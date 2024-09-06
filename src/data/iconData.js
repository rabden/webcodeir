import * as LucideIcons from 'lucide-react';

const iconGroups = [
  ['Activity', 'AlertCircle', 'AlertTriangle', 'Anchor', 'Archive', 'ArrowDown', 'ArrowDownCircle', 
   'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowUpCircle', 'Award', 'BarChart', 'Battery', 
   'BatteryCharging', 'Bell', 'BellOff', 'Bluetooth', 'Bold', 'Book', 'Bookmark', 'Box', 'Briefcase'],
  ['Calendar', 'Camera', 'CameraOff', 'Cast', 'Check', 'CheckCircle', 'CheckSquare', 'ChevronDown', 
   'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Chrome', 'Circle', 'Clipboard', 'Clock', 'Cloud', 
   'CloudDrizzle', 'CloudLightning', 'CloudRain', 'CloudSnow', 'Code', 'Codepen', 'Codesandbox', 
   'Coffee', 'Command', 'Compass', 'Copy'],
  ['CornerDownLeft', 'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp', 'CornerRightDown', 
   'CornerRightUp', 'CornerUpLeft', 'CornerUpRight', 'Cpu', 'CreditCard', 'Crop', 'Database', 
   'Delete', 'Disc', 'Divide', 'DollarSign', 'Download', 'Dribbble', 'Droplet', 'Edit', 'ExternalLink', 
   'Eye', 'EyeOff'],
  ['Facebook', 'Feather', 'File', 'FileMinus', 'FilePlus', 'FileText', 'Film', 'Filter', 'Flag', 
   'Folder', 'Frown', 'Gift', 'GitBranch', 'Github', 'Gitlab', 'Globe', 'Grid', 'HardDrive', 'Hash', 
   'Headphones', 'Heart', 'Hexagon', 'Home', 'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key'],
  ['Layers', 'Layout', 'LifeBuoy', 'Link', 'Linkedin', 'List', 'Loader', 'Lock', 'LogOut', 'Mail', 
   'Map', 'MapPin', 'Maximize', 'Maximize2', 'Meh', 'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 
   'MicOff', 'Minimize', 'Minimize2', 'Minus', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical', 
   'Mouse', 'Move', 'Music'],
  ['Octagon', 'Package', 'Paperclip', 'Pause', 'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded', 
   'PhoneIncoming', 'PhoneOff', 'PhoneOutgoing', 'PieChart', 'Play', 'Plus', 'Pocket', 'Power', 
   'Printer', 'Radio', 'RefreshCw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Rss', 'Save', 
   'Scissors', 'Search', 'Send', 'Server', 'Settings'],
  ['Share', 'Share2', 'Shield', 'ShoppingBag', 'ShoppingCart', 'Shuffle', 'Sidebar', 'Slash', 
   'Sliders', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'StopCircle', 'Sun', 'Sunrise', 
   'Sunset', 'Tablet', 'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown', 'ThumbsUp', 
   'ToggleLeft', 'ToggleRight', 'Trash', 'Trash2', 'Trello'],
  ['TrendingDown', 'TrendingUp', 'Triangle', 'Truck', 'Tv', 'Twitter', 'Type', 'Umbrella', 'Underline', 
   'Unlock', 'Upload', 'User', 'UserCheck', 'UserMinus', 'UserPlus', 'UserX', 'Users', 'Video', 
   'Voicemail', 'Volume', 'VolumeX', 'Watch', 'Wifi', 'Wind', 'X', 'XCircle', 'XOctagon', 'Youtube', 
   'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut']
];

export const topIcons = Object.fromEntries(
  iconGroups.flatMap(group => group.map(iconName => [iconName, LucideIcons[iconName]]))
);

export const additionalIcons = Object.fromEntries(
  Object.entries(LucideIcons).filter(([key]) => !topIcons[key])
);