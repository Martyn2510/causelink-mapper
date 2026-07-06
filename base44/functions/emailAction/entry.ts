import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, action } = await req.json();

    if (!email || !action) {
      return Response.json({ error: 'Email address and action data are required' }, { status: 400 });
    }

    const lines = [];
    lines.push('A corrective action has been shared with you from CauseLink Mapper.\n');
    if (action.cause) lines.push(`Linked cause: ${action.cause}\n`);
    lines.push(`Action: ${action.action}\n`);
    if (action.owner) lines.push(`Owner: ${action.owner}`);
    if (action.priority) lines.push(`Priority: ${action.priority}`);
    if (action.due_date) lines.push(`Due date: ${action.due_date}`);
    if (action.status) lines.push(`Status: ${action.status}`);
    lines.push('\n— CauseLink Mapper');

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `Corrective Action — ${action.action?.slice(0, 60) || 'Action'}`,
      body: lines.join('\n'),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});