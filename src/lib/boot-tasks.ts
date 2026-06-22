export interface BootTask {
  message: string;
  min: number;
  max: number;
  warn?: boolean;
}

export const BOOT_TASKS: BootTask[] = [
  { message: 'Loading <b>RyanOS</b> kernel v2025.1', min: 8, max: 15 },
  { message: 'Initialising <b>memory</b> — 16GB allocated', min: 5, max: 12 },
  { message: 'Mounting <b>/ryan</b> — identity loaded', min: 10, max: 20 },
  { message: 'Setting <b>locale</b> — en_SG.UTF-8', min: 3, max: 8 },
  { message: 'Starting <b>nvim</b> v0.10.2', min: 30, max: 60 },
  { message: 'Plugin: <b>rose-pine</b> — colorscheme loaded', min: 12, max: 25 },
  { message: 'Plugin: <b>nvim-treesitter</b> — 14 parsers', min: 40, max: 80 },
  { message: 'Plugin: <b>nvim-lspconfig</b> — lua_ls, pyright, rust_analyzer', min: 50, max: 100 },
  { message: 'Plugin: <b>mason.nvim</b> — 6 tools installed', min: 35, max: 70 },
  { message: 'Plugin: <b>telescope.nvim</b> — fuzzy finder ready', min: 20, max: 40 },
  { message: 'Plugin: <b>nvim-cmp</b> — completion engine', min: 15, max: 30 },
  { message: 'Plugin: <b>nvim-tree</b> — file explorer', min: 10, max: 20 },
  { message: 'Plugin: <b>lualine.nvim</b> — statusline', min: 8, max: 15 },
  { message: 'Plugin: <b>gitsigns.nvim</b> — git integration', min: 12, max: 25 },
  { message: 'Plugin: <b>which-key.nvim</b> — keybind hints', min: 10, max: 18 },
  { message: 'Loading <b>courses/</b> — 60 modules, 21 reviews', min: 20, max: 45 },
  { message: 'Loading <b>.journal/</b> — 9 entries (hidden)', min: 8, max: 15 },
  { message: 'Job market: <b>competitive</b> — stay sharp', min: 5, max: 10, warn: true },
  { message: 'Hi there, <b>random stranger</b>!', min: 5, max: 10 },
];
