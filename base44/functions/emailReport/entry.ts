import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, fileUrl, title } = await req.json();

    if (!email || !fileUrl) {
      return Response.json({ error: 'Email address and file URL are required' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `Investigation Report — ${title || 'Untitled'}`,
      body: `Your investigation report "${title || 'Untitled'}" is ready for download.\n\nDownload the PDF here: ${fileUrl}\n\nThis report was AI-generated from investigation data. Review and verify all content before distribution.\n\n— CauseLink Mapper`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});