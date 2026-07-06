import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, action } = await req.json();

    if (!email || !action) {
      return Response.json({ error: 'Email address and action data are required' }, { status: 400 });
    }

    // Validate email format to prevent header injection
    const emailRegex = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Enforce recipient whitelist: only registered app users may receive emails
    const recipients = await base44.asServiceRole.entities.User.filter({ email });
    const isRegistered = Array.isArray(recipients) && recipients.some(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );
    if (!isRegistered) {
      return Response.json({ error: 'Recipient must be a registered app user' }, { status: 403 });
    }

    // Sanitize all text fields: strip newlines/control chars to prevent header injection
    const clean = (v) => String(v || '').replace(/[\r\n\0]/g, ' ').slice(0, 500);

    const actionText = clean(action.action).slice(0, 60);
    const subject = `Corrective Action — ${actionText}`;

    const lines = [];
    lines.push('A corrective action has been shared with you from CauseLink Mapper.');
    lines.push('');
    if (action.cause) lines.push(`Linked cause: ${clean(action.cause)}`);
    lines.push(`Action: ${clean(action.action)}`);
    if (action.owner) lines.push(`Owner: ${clean(action.owner)}`);
    if (action.priority) lines.push(`Priority: ${clean(action.priority)}`);
    if (action.due_date) lines.push(`Due date: ${clean(action.due_date)}`);
    if (action.status) lines.push(`Status: ${clean(action.status)}`);
    lines.push('');
    lines.push('— CauseLink Mapper');

    const rawMessage = [
      `To: ${email}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=UTF-8',
      'MIME-Version: 1.0',
      '',
      lines.join('\n'),
    ].join('\r\n');

    // Recipient whitelist already enforced above — only registered app users can receive
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: base64UrlEncode(rawMessage) }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Gmail API error: ${errText}` }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});