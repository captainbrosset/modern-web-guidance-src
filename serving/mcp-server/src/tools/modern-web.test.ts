import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerModernWebTools } from './modern-web.js';
import * as modernPractices from '../data/modern-practices.js';

// Mock McpServer
const mockTool = vi.fn();
const mockServer = {
  tool: mockTool,
  registerTool: mockTool,
} as any;

// Mock modern-practices data
vi.mock('../data/modern-practices.js');

describe('modern-web tools', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should register list_use_cases and get_best_practices tools', () => {
    registerModernWebTools(mockServer);

    expect(mockTool).toHaveBeenCalledTimes(2);
    expect(mockTool).toHaveBeenCalledWith(
      'list_use_cases',
      expect.any(Object),
      expect.any(Function)
    );
    expect(mockTool).toHaveBeenCalledWith(
      'get_best_practices',
      expect.any(Object),
      expect.any(Function)
    );
  });

  describe('list_use_cases handler', () => {
    it('should return use cases list', async () => {
      const mockUseCases = [{ id: 'test', category: 'webperf' }];
      vi.mocked(modernPractices.getUseCasesByCategory).mockReturnValue(mockUseCases as any);

      registerModernWebTools(mockServer);
      const handler = mockTool.mock.calls.find(call => call[0] === 'list_use_cases')![2];

      const result = await handler({ category: 'webperf' });

      expect(JSON.parse(result.content[0].text)).toEqual(mockUseCases);
      expect(modernPractices.getUseCasesByCategory).toHaveBeenCalledWith('webperf');
    });
  });

  describe('get_best_practices handler', () => {
    it('should return guide content if found', async () => {
      const mockGuide = '# Guide Content';
      vi.mocked(modernPractices.getGuide).mockResolvedValue(mockGuide);

      registerModernWebTools(mockServer);
      const handler = mockTool.mock.calls.find(call => call[0] === 'get_best_practices')![2];

      const result = await handler({ use_case_id: 'test-id' });

      expect(result.content[0].text).toBe(mockGuide);
      expect(modernPractices.getGuide).toHaveBeenCalledWith('test-id');
    });

    it('should return error if guide not found', async () => {
      vi.mocked(modernPractices.getGuide).mockResolvedValue(null);

      registerModernWebTools(mockServer);
      const handler = mockTool.mock.calls.find(call => call[0] === 'get_best_practices')![2];

      const result = await handler({ use_case_id: 'unknown-id' });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('No guide found');
    });
  });
});
