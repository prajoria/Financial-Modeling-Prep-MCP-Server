import { describe, it, expect, vi } from 'vitest';
import { registerPrompts } from './registerPrompts.js';

describe('registerPrompts', () => {
  function createMockServer(hasPrompt = true) {
    const calls: any = { tools: [] };
    const server: any = {
      tool: vi.fn((name: string, _desc: string, _schema: any, handler: any) => {
        calls.tools.push({ name, handler });
      })
    };
    if (hasPrompt) {
      server.prompt = vi.fn((_name: string, _title: string, _schema: any, handler: any) => {
        calls.prompt = { handler };
      });
    }
    return { server, calls };
  }

  const baseCtx = {
    mode: 'ALL_TOOLS' as const,
    version: '1.0.0',
    listChanged: false,
  };

  it('registers native prompt when supported and tool alias always', async () => {
    const { server, calls } = createMockServer(true);
    registerPrompts(server, baseCtx);

    expect(server.prompt).toHaveBeenCalled();
    expect(server.tool).toHaveBeenCalledWith(
      'list_mcp_assets',
      expect.any(String),
      expect.any(Object),
      expect.any(Function)
    );

    // Execute handlers to ensure they return structured content
    const promptResult = await calls.prompt.handler();
    expect(promptResult.messages[0].content[0].text).toContain('# Server Capabilities');

    const toolResult = await calls.tools[0].handler();
    expect(toolResult.content[0].text).toContain('## Tools');
  });

  it('falls back to tool alias when prompt API not available', async () => {
    const { server, calls } = createMockServer(false);
    registerPrompts(server, { ...baseCtx, mode: 'STATIC_TOOL_SETS', staticToolSets: ['search'] as any });

    expect(server.prompt).toBeUndefined();
    expect(server.tool).toHaveBeenCalled();

    const toolResult = await calls.tools[0].handler();
    expect(toolResult.content[0].text).toContain('Static mode');
  });

  it('renders dynamic mode content with meta-tools note', async () => {
    const { server, calls } = createMockServer(true);
    registerPrompts(server, { ...baseCtx, mode: 'DYNAMIC_TOOL_DISCOVERY', listChanged: true });
    const toolResult = await calls.tools[0].handler();
    expect(toolResult.content[0].text).toContain('enable_toolset');
    expect(toolResult.content[0].text).toContain('get_toolset_status');
  });
});


