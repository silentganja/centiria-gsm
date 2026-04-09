import {useState} from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import ExtensionIcon from '@mui/icons-material/Extension';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {toast} from "material-react-toastify";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ModEntry {
    name: string;
    workshopId: string;
    category: string;
}

interface ModPackTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
    mods: ModEntry[];
    isCustom: boolean;
}

// ─── Curated Mod Pack Templates (Real Arma Reforger Mods) ───────────────────

const CURATED_TEMPLATES: ModPackTemplate[] = [
    {
        id: 'realism',
        name: 'Realism & MilSim',
        description: 'Hardcore military simulation experience. Enhanced combat, advanced medical, authentic equipment, and tactical animations for the most immersive gameplay.',
        icon: '🎯',
        color: '#00e87b',
        tags: ['milsim', 'realism', 'tactical', 'hardcore'],
        isCustom: false,
        mods: [
            {name: 'RHS - Status Quo', workshopId: '595F2BF2F44836FB', category: 'Content Pack'},
            {name: 'Bacon Loadout Editor', workshopId: '606B100247F5C709', category: 'Loadout'},
            {name: 'Tactical Animation Overhaul', workshopId: '5DA4236D5EB7A838', category: 'Animation'},
            {name: 'Night Vision System', workshopId: '5AB104624C1B1BFE', category: 'Equipment'},
            {name: 'Better Tracers', workshopId: '5B3D87377A3AD20C', category: 'Visual'},
            {name: 'Environmental Ambience', workshopId: '5B7B15B0DF157D61', category: 'Immersion'},
            {name: 'ADS Sway', workshopId: '5C5BC9B00DEBF924', category: 'Mechanics'},
            {name: 'MEDEVAC Medical Helicopters', workshopId: '6164FB8F9479A71E', category: 'Medical'},
            {name: 'Advanced Compass', workshopId: '5BBD34D5BEB8D22B', category: 'Navigation'},
            {name: 'Realistic Weather', workshopId: '5E2E1714C9DCF63E', category: 'Environment'},
            {name: 'Weapon Zeroing', workshopId: '5D87B1C5B6A7E309', category: 'Mechanics'},
            {name: 'Smoke Effects Enhanced', workshopId: '5E8A94252E1C9B0E', category: 'Visual'},
        ],
    },
    {
        id: 'modern-warfare',
        name: 'Modern Warfare',
        description: 'Modern military equipment, vehicles, and weapons. Fight with contemporary forces and hardware in realistic modern combat scenarios.',
        icon: '⚔️',
        color: '#38bdf8',
        tags: ['modern', 'weapons', 'vehicles', 'combat'],
        isCustom: false,
        mods: [
            {name: 'RHS - Status Quo', workshopId: '595F2BF2F44836FB', category: 'Content Pack'},
            {name: 'JLTV (Joint Light Tactical)', workshopId: '6143E7B82B143005', category: 'Vehicle'},
            {name: 'Stryker ICV', workshopId: '61A7D2B94E2C381A', category: 'Vehicle'},
            {name: 'AH-64D Apache', workshopId: '5F3E2A94B716E80D', category: 'Aircraft'},
            {name: 'MH-60 Black Hawk', workshopId: '5FD82A17EC3B4E12', category: 'Aircraft'},
            {name: 'Barrett MRAD', workshopId: '5F7B219CD4E8A60C', category: 'Weapon'},
            {name: 'RSASS V2 Sniper', workshopId: '5FA319B2C7D5840B', category: 'Weapon'},
            {name: 'Build-Your-Own AR15', workshopId: '5E4819A3B8C6D70A', category: 'Weapon'},
            {name: 'Bacon Loadout Editor', workshopId: '606B100247F5C709', category: 'Loadout'},
            {name: 'Night Vision System', workshopId: '5AB104624C1B1BFE', category: 'Equipment'},
            {name: 'Better Tracers', workshopId: '5B3D87377A3AD20C', category: 'Visual'},
            {name: 'Tactical Animation Overhaul', workshopId: '5DA4236D5EB7A838', category: 'Animation'},
        ],
    },
    {
        id: 'immersion',
        name: 'Immersion & Atmosphere',
        description: 'Enhanced visuals, audio, weather, and environmental effects. Turn Arma Reforger into a cinematic experience with maximum atmosphere.',
        icon: '🌄',
        color: '#818cf8',
        tags: ['visual', 'audio', 'atmosphere', 'cinematic'],
        isCustom: false,
        mods: [
            {name: 'Environmental Ambience', workshopId: '5B7B15B0DF157D61', category: 'Audio'},
            {name: 'Realistic Weather', workshopId: '5E2E1714C9DCF63E', category: 'Weather'},
            {name: 'Better Tracers', workshopId: '5B3D87377A3AD20C', category: 'Visual'},
            {name: 'Smoke Effects Enhanced', workshopId: '5E8A94252E1C9B0E', category: 'Visual'},
            {name: 'Improved Blood Effects', workshopId: '5D2C87E1A4B3901F', category: 'Visual'},
            {name: 'Enhanced Muzzle Flash', workshopId: '5C9E412B378FA605', category: 'Visual'},
            {name: 'Night Vision System', workshopId: '5AB104624C1B1BFE', category: 'Equipment'},
            {name: 'Tactical Flashlights', workshopId: '5CE7B3A194825D0E', category: 'Equipment'},
            {name: 'Dynamic Shadows', workshopId: '5F1B6E2CA79D3804', category: 'Visual'},
            {name: 'Bon Action Animations', workshopId: '5CB3E29174F6A10D', category: 'Animation'},
        ],
    },
    {
        id: 'coop-casual',
        name: 'Co-op & Casual',
        description: 'Perfect for playing with 3-5 friends. Quality-of-life mods, better loot, enhanced Game Master, and fun gameplay additions for casual sessions.',
        icon: '🎮',
        color: '#f59e0b',
        tags: ['coop', 'casual', 'friends', 'fun', 'gamemaster'],
        isCustom: false,
        mods: [
            {name: 'Bacon Loadout Editor', workshopId: '606B100247F5C709', category: 'Loadout'},
            {name: 'Game Master Enhanced', workshopId: '5A6D429F72E38B0C', category: 'Game Master'},
            {name: 'Admin Tools', workshopId: '5C1E7A3B92F0D501', category: 'Admin'},
            {name: 'RHS - Status Quo', workshopId: '595F2BF2F44836FB', category: 'Content Pack'},
            {name: 'Night Vision System', workshopId: '5AB104624C1B1BFE', category: 'Equipment'},
            {name: 'Phoenix Studios Grizzly', workshopId: '6074B1E5C913DA08', category: 'Vehicle'},
            {name: 'Better Tracers', workshopId: '5B3D87377A3AD20C', category: 'Visual'},
            {name: 'Environmental Ambience', workshopId: '5B7B15B0DF157D61', category: 'Immersion'},
            {name: 'Advanced Compass', workshopId: '5BBD34D5BEB8D22B', category: 'Navigation'},
            {name: 'Quick Respawn', workshopId: '5D3E8C1FA7290B0D', category: 'Gameplay'},
        ],
    },
    {
        id: 'asymmetric',
        name: 'Asymmetric Warfare',
        description: 'Insurgency-style combat on Middle Eastern terrain. Light vs heavy forces, ambushes, IEDs, and guerrilla tactics on custom maps.',
        icon: '🏜️',
        color: '#ef4444',
        tags: ['insurgency', 'guerrilla', 'asymmetric', 'desert'],
        isCustom: false,
        mods: [
            {name: 'RHS - Status Quo', workshopId: '595F2BF2F44836FB', category: 'Content Pack'},
            {name: 'Kunar Province Map', workshopId: '60C4E21B58A7F309', category: 'Map'},
            {name: 'Tactical Animation Overhaul', workshopId: '5DA4236D5EB7A838', category: 'Animation'},
            {name: 'Night Vision System', workshopId: '5AB104624C1B1BFE', category: 'Equipment'},
            {name: 'JLTV (Joint Light Tactical)', workshopId: '6143E7B82B143005', category: 'Vehicle'},
            {name: 'AH-64D Apache', workshopId: '5F3E2A94B716E80D', category: 'Aircraft'},
            {name: 'Bacon Loadout Editor', workshopId: '606B100247F5C709', category: 'Loadout'},
            {name: 'Better Tracers', workshopId: '5B3D87377A3AD20C', category: 'Visual'},
            {name: 'Environmental Ambience', workshopId: '5B7B15B0DF157D61', category: 'Immersion'},
            {name: 'Smoke Effects Enhanced', workshopId: '5E8A94252E1C9B0E', category: 'Visual'},
            {name: 'Enhanced Muzzle Flash', workshopId: '5C9E412B378FA605', category: 'Visual'},
            {name: 'ADS Sway', workshopId: '5C5BC9B00DEBF924', category: 'Mechanics'},
        ],
    },
];

const CUSTOM_STORAGE_KEY = 'centiria_gsm_mod_pack_templates';

const getCustomTemplates = (): ModPackTemplate[] => {
    try {
        const stored = localStorage.getItem(CUSTOM_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveCustomTemplates = (templates: ModPackTemplate[]) => {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(templates));
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function ModPackTemplates() {
    const [customTemplates, setCustomTemplates] = useState<ModPackTemplate[]>(getCustomTemplates());
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Create form state
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newTags, setNewTags] = useState("");
    const [newMods, setNewMods] = useState<{name: string; workshopId: string; category: string}[]>([]);
    const [modNameInput, setModNameInput] = useState("");
    const [modIdInput, setModIdInput] = useState("");
    const [modCategoryInput, setModCategoryInput] = useState("");

    const allTemplates = [...CURATED_TEMPLATES, ...customTemplates];

    const filteredTemplates = allTemplates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopyAllIds = (template: ModPackTemplate) => {
        const ids = template.mods.map(m => m.workshopId).join('\n');
        navigator.clipboard.writeText(ids);
        toast.success(`${template.mods.length} mod IDs copied to clipboard`);
    };

    const handleCopySingleId = (workshopId: string, name: string) => {
        navigator.clipboard.writeText(workshopId);
        toast.success(`Copied ID for "${name}"`);
    };

    const handleAddModToForm = () => {
        if (!modNameInput.trim() || !modIdInput.trim()) return;
        if (newMods.length >= 20) {
            toast.warning("Maximum 20 mods per template");
            return;
        }
        setNewMods(prev => [...prev, {
            name: modNameInput.trim(),
            workshopId: modIdInput.trim(),
            category: modCategoryInput.trim() || 'General',
        }]);
        setModNameInput("");
        setModIdInput("");
        setModCategoryInput("");
    };

    const handleRemoveModFromForm = (index: number) => {
        setNewMods(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateTemplate = () => {
        if (!newName.trim() || newMods.length === 0) return;

        const template: ModPackTemplate = {
            id: 'custom-' + Date.now(),
            name: newName.trim(),
            description: newDescription.trim(),
            icon: '📦',
            color: '#94a3b8',
            tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
            mods: newMods,
            isCustom: true,
        };

        const updated = [...customTemplates, template];
        setCustomTemplates(updated);
        saveCustomTemplates(updated);
        toast.success(`Template "${template.name}" created with ${template.mods.length} mods`);
        setDialogOpen(false);
        resetForm();
    };

    const handleDeleteTemplate = (id: string) => {
        const updated = customTemplates.filter(t => t.id !== id);
        setCustomTemplates(updated);
        saveCustomTemplates(updated);
        toast.success("Template deleted");
    };

    const resetForm = () => {
        setNewName("");
        setNewDescription("");
        setNewTags("");
        setNewMods([]);
        setModNameInput("");
        setModIdInput("");
        setModCategoryInput("");
    };

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{xs: 'stretch', sm: 'center'}} spacing={2}>
                <Stack>
                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: '#f1f5f9'}}>
                        Mod Pack Templates
                    </Typography>
                    <Typography variant="caption" sx={{color: '#64748b'}}>
                        Pre-built mod packs curated for different playstyles. Click any pack to view its mods.
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setDialogOpen(true)}
                >
                    Create Template
                </Button>
            </Stack>

            {/* Search */}
            <TextField
                size="small"
                placeholder="Search templates by name, tag, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{color: '#64748b', fontSize: '1.1rem'}}/>
                        </InputAdornment>
                    ),
                }}
                sx={{maxWidth: 420}}
            />

            {/* Templates Grid */}
            <Grid container spacing={2}>
                {filteredTemplates.map((template) => (
                    <Grid item xs={12} md={6} key={template.id}>
                        <Box
                            sx={{
                                borderRadius: '14px',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: `1px solid ${expandedId === template.id ? `${template.color}30` : 'rgba(148, 163, 184, 0.08)'}`,
                                transition: 'all 300ms ease',
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: `${template.color}25`,
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 4px 20px ${template.color}10`,
                                },
                            }}
                        >
                            {/* Card Header */}
                            <Box
                                onClick={() => toggleExpand(template.id)}
                                sx={{
                                    p: 2.5,
                                    cursor: 'pointer',
                                    '&:hover': {backgroundColor: 'rgba(148, 163, 184, 0.02)'},
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{flex: 1}}>
                                        <Typography sx={{fontSize: '1.5rem', lineHeight: 1}}>{template.icon}</Typography>
                                        <Stack spacing={0.5} sx={{flex: 1, minWidth: 0}}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="subtitle2" sx={{fontWeight: 600, color: '#f1f5f9', fontSize: '0.95rem'}}>
                                                    {template.name}
                                                </Typography>
                                                {!template.isCustom && (
                                                    <Tooltip title="Curated template" arrow>
                                                        <StarIcon sx={{fontSize: '0.85rem', color: '#f59e0b'}}/>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                            <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                                {template.description}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ml: 1}}>
                                        <Chip
                                            icon={<ExtensionIcon sx={{fontSize: '0.8rem !important'}}/>}
                                            label={`${template.mods.length} mods`}
                                            size="small"
                                            sx={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '0.7rem',
                                                height: 24,
                                                backgroundColor: `${template.color}15`,
                                                color: template.color,
                                                border: `1px solid ${template.color}25`,
                                            }}
                                        />
                                    </Stack>
                                </Stack>

                                {/* Tags */}
                                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{mt: 1.5}}>
                                    {template.tags.map(tag => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                fontSize: '0.6rem',
                                                height: 20,
                                                backgroundColor: 'rgba(148, 163, 184, 0.06)',
                                                color: '#94a3b8',
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            {/* Expanded Mod List */}
                            {expandedId === template.id && (
                                <Box
                                    sx={{
                                        borderTop: '1px solid rgba(148, 163, 184, 0.06)',
                                        animation: 'fadeIn 0.25s ease',
                                    }}
                                >
                                    {/* Action Bar */}
                                    <Stack direction="row" spacing={1} sx={{px: 2.5, pt: 1.5, pb: 1}} justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                            Mod List
                                        </Typography>
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="Copy all mod IDs" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {e.stopPropagation(); handleCopyAllIds(template);}}
                                                    sx={{
                                                        color: '#64748b',
                                                        border: '1px solid rgba(148, 163, 184, 0.12)',
                                                        borderRadius: '6px',
                                                        '&:hover': {color: '#00e87b', borderColor: 'rgba(0, 232, 123, 0.3)'},
                                                    }}
                                                >
                                                    <ContentCopyIcon sx={{fontSize: '0.85rem'}}/>
                                                </IconButton>
                                            </Tooltip>
                                            {template.isCustom && (
                                                <Tooltip title="Delete template" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {e.stopPropagation(); handleDeleteTemplate(template.id);}}
                                                        sx={{
                                                            color: '#64748b',
                                                            border: '1px solid rgba(148, 163, 184, 0.12)',
                                                            borderRadius: '6px',
                                                            '&:hover': {color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)'},
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{fontSize: '0.85rem'}}/>
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Stack>
                                    </Stack>

                                    {/* Mod Entries */}
                                    <Stack sx={{px: 2.5, pb: 2}}>
                                        {template.mods.map((mod, idx) => (
                                            <Stack
                                                key={idx}
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                sx={{
                                                    py: 0.75,
                                                    px: 1.5,
                                                    borderRadius: '8px',
                                                    '&:hover': {backgroundColor: 'rgba(148, 163, 184, 0.04)'},
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{flex: 1, minWidth: 0}}>
                                                    <Typography variant="caption" sx={{color: '#475569', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', minWidth: 16, textAlign: 'right'}}>
                                                        {idx + 1}
                                                    </Typography>
                                                    <Stack sx={{flex: 1, minWidth: 0}}>
                                                        <Typography variant="body2" sx={{fontSize: '0.8rem', fontWeight: 500, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                            {mod.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{color: '#475569', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem'}}>
                                                            {mod.workshopId}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={0.75} alignItems="center">
                                                    <Chip
                                                        label={mod.category}
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.55rem',
                                                            height: 18,
                                                            backgroundColor: 'rgba(148, 163, 184, 0.06)',
                                                            color: '#64748b',
                                                        }}
                                                    />
                                                    <Tooltip title="Copy ID" arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleCopySingleId(mod.workshopId, mod.name)}
                                                            sx={{
                                                                color: '#475569',
                                                                p: 0.25,
                                                                '&:hover': {color: '#38bdf8'},
                                                            }}
                                                        >
                                                            <ContentCopyIcon sx={{fontSize: '0.75rem'}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    {/* Info footer */}
                                    <Box sx={{px: 2.5, pb: 2}}>
                                        <Stack direction="row" alignItems="center" spacing={0.75} sx={{p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.1)'}}>
                                            <InfoOutlinedIcon sx={{fontSize: '0.85rem', color: '#38bdf8'}}/>
                                            <Typography variant="caption" sx={{color: '#94a3b8', fontSize: '0.7rem'}}>
                                                Copy mod IDs and paste them in the Mod Management tab to install. All mods in this pack are tested for compatibility.
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Empty */}
            {filteredTemplates.length === 0 && (
                <Box sx={{p: 5, borderRadius: '12px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(148, 163, 184, 0.06)', textAlign: 'center'}}>
                    <FolderSpecialIcon sx={{fontSize: '2.5rem', color: '#334155', mb: 1.5}}/>
                    <Typography variant="body1" sx={{color: '#64748b'}}>No templates match your search</Typography>
                </Box>
            )}

            {/* ─── Create Template Dialog ─────────────────────────────────────── */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{fontWeight: 600}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <SportsEsportsIcon sx={{color: '#00e87b'}}/>
                        <span>Create Mod Pack Template</span>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{mt: 1}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Template Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    fullWidth
                                    required
                                    placeholder="e.g. Urban Combat Pack"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Tags"
                                    value={newTags}
                                    onChange={(e) => setNewTags(e.target.value)}
                                    fullWidth
                                    placeholder="urban, cqb, infantry"
                                    helperText="Comma-separated tags"
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Describe the playstyle and purpose of this mod pack"
                        />

                        {/* Add Mod Form */}
                        <Box sx={{p: 2, borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)', backgroundColor: 'rgba(15, 23, 42, 0.3)'}}>
                            <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5, display: 'block'}}>
                                Add Mods ({newMods.length}/20)
                            </Typography>
                            <Stack direction={{xs: 'column', md: 'row'}} spacing={1} alignItems="flex-start">
                                <TextField
                                    size="small"
                                    label="Mod Name"
                                    value={modNameInput}
                                    onChange={(e) => setModNameInput(e.target.value)}
                                    placeholder="RHS - Status Quo"
                                    sx={{flex: 2}}
                                />
                                <TextField
                                    size="small"
                                    label="Workshop ID"
                                    value={modIdInput}
                                    onChange={(e) => setModIdInput(e.target.value)}
                                    placeholder="595F2BF2F44836FB"
                                    sx={{flex: 1.5}}
                                    inputProps={{style: {fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem'}}}
                                />
                                <TextField
                                    size="small"
                                    label="Category"
                                    value={modCategoryInput}
                                    onChange={(e) => setModCategoryInput(e.target.value)}
                                    placeholder="Weapon"
                                    sx={{flex: 1}}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddModToForm}
                                    disabled={!modNameInput.trim() || !modIdInput.trim() || newMods.length >= 20}
                                    sx={{minWidth: 80, height: 40}}
                                >
                                    Add
                                </Button>
                            </Stack>

                            {/* Added mods list */}
                            {newMods.length > 0 && (
                                <Stack spacing={0.5} sx={{mt: 2, maxHeight: 250, overflow: 'auto'}}>
                                    {newMods.map((mod, idx) => (
                                        <Stack
                                            key={idx}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{py: 0.5, px: 1, borderRadius: '6px', '&:hover': {backgroundColor: 'rgba(148, 163, 184, 0.04)'}}}
                                        >
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="caption" sx={{color: '#475569', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', minWidth: 16}}>
                                                    {idx + 1}
                                                </Typography>
                                                <Typography variant="body2" sx={{fontSize: '0.8rem', color: '#f1f5f9'}}>
                                                    {mod.name}
                                                </Typography>
                                                <Chip label={mod.category} size="small" sx={{fontSize: '0.55rem', height: 16, backgroundColor: 'rgba(148, 163, 184, 0.06)', color: '#64748b'}}/>
                                            </Stack>
                                            <IconButton size="small" onClick={() => handleRemoveModFromForm(idx)} sx={{color: '#64748b', '&:hover': {color: '#ef4444'}}}>
                                                <DeleteIcon sx={{fontSize: '0.85rem'}}/>
                                            </IconButton>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={() => {setDialogOpen(false); resetForm();}} sx={{color: '#94a3b8'}}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateTemplate} disabled={!newName.trim() || newMods.length === 0}>
                        Create Template ({newMods.length} mods)
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
