import * as LucideIcons from 'lucide-react';

const iconGroups = [
  ['Activity', 'AlertCircle', 'AlertTriangle', 'AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight', 'Anchor', 'Aperture', 'Archive', 'ArrowDown', 'ArrowDownCircle', 'ArrowLeft', 'ArrowLeftCircle', 'ArrowRight', 'ArrowRightCircle', 'ArrowUp', 'ArrowUpCircle', 'AtSign', 'Award'],
  ['Axe', 'BaggageClaim', 'Ban', 'Banknote', 'BarChart', 'BarChart2', 'Battery', 'BatteryCharging', 'Bell', 'BellMinus', 'BellOff', 'BellPlus', 'BellRing', 'Bike', 'Binary', 'Bitcoin', 'Bluetooth', 'Bold', 'Book', 'BookOpen'],
  ['Bookmark', 'Box', 'Briefcase', 'Building', 'Building2', 'Bus', 'Calculator', 'Calendar', 'Camera', 'CameraOff', 'Car', 'Cast', 'Check', 'CheckCircle', 'CheckSquare', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronsDown'],
  ['ChevronsLeft', 'ChevronsRight', 'ChevronsUp', 'Chrome', 'Circle', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle', 'CloudLightning', 'CloudOff', 'CloudRain', 'CloudSnow', 'Code', 'Codepen', 'Codesandbox', 'Coffee', 'Columns', 'Command', 'Compass'],
  ['Copy', 'Copyright', 'CornerDownLeft', 'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp', 'CornerRightDown', 'CornerRightUp', 'CornerUpLeft', 'CornerUpRight', 'Cpu', 'CreditCard', 'Crop', 'Crosshair', 'Database', 'Delete', 'Disc', 'Divide', 'DivideCircle', 'DivideSquare'],
  ['DollarSign', 'Download', 'DownloadCloud', 'Dribbble', 'Droplet', 'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye', 'EyeOff', 'Facebook', 'FastForward', 'Feather', 'Figma', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Film'],
  ['Filter', 'Flag', 'Folder', 'FolderMinus', 'FolderPlus', 'Framer', 'Frown', 'Gift', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'Github', 'Gitlab', 'Globe', 'Grid', 'HardDrive', 'Hash', 'Headphones', 'Heart'],
  ['HelpCircle', 'Hexagon', 'Home', 'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key', 'Layers', 'Layout', 'LifeBuoy', 'Link', 'Link2', 'Linkedin', 'List', 'Loader', 'Lock', 'LogIn', 'LogOut'],
  ['Mail', 'Map', 'MapPin', 'Maximize', 'Maximize2', 'Meh', 'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 'MicOff', 'Minimize', 'Minimize2', 'Minus', 'MinusCircle', 'MinusSquare', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical'],
  ['MousePointer', 'Move', 'Music', 'Navigation', 'Navigation2', 'Octagon', 'Package', 'Paperclip', 'Pause', 'PauseCircle', 'PenTool', 'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneOff', 'PhoneOutgoing', 'PieChart', 'Play'],
  ['PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket', 'Power', 'Printer', 'Radio', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Rss', 'Save', 'Scissors', 'Search', 'Send', 'Server'],
  ['Settings', 'Share', 'Share2', 'Shield', 'ShieldOff', 'ShoppingBag', 'ShoppingCart', 'Shuffle', 'Sidebar', 'SkipBack', 'SkipForward', 'Slack', 'Slash', 'Sliders', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'StopCircle'],
  ['Sun', 'Sunrise', 'Sunset', 'Table', 'Tablet', 'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown', 'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Tool', 'Trash', 'Trash2', 'Trello', 'TrendingDown', 'TrendingUp', 'Triangle'],
  ['Truck', 'Tv', 'Twitch', 'Twitter', 'Type', 'Umbrella', 'Underline', 'Unlock', 'Upload', 'UploadCloud', 'User', 'UserCheck', 'UserMinus', 'UserPlus', 'UserX', 'Users', 'Video', 'VideoOff', 'Voicemail', 'Volume'],
  ['Volume1', 'Volume2', 'VolumeX', 'Watch', 'Wifi', 'WifiOff', 'Wind', 'X', 'XCircle', 'XOctagon', 'XSquare', 'Youtube', 'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut']
];

export const topIcons = Object.fromEntries(
  iconGroups.flatMap(group => group.map(iconName => [iconName, LucideIcons[iconName]]))
);

export const additionalIcons = Object.fromEntries(
  Object.entries(LucideIcons).filter(([key]) => !topIcons[key])
);