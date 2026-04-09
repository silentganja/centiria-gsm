import {useState} from "react";
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExtensionIcon from '@mui/icons-material/Extension';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {toast} from "material-react-toastify";

interface CollectionItem {
    id: string;
    name: string;
    description: string;
    modIds: string[];
    tags: string[];
    createdAt: Date;
}

const STORAGE_KEY = 'centiria_gsm_collections';

const getStoredCollections = (): CollectionItem[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveCollections = (collections: CollectionItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
};

export default function ModsCollections() {
    const [collections, setCollections] = useState<CollectionItem[]>(getStoredCollections());
    const [searchQuery, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newModIds, setNewModIds] = useState("");
    const [newTags, setNewTags] = useState("");

    const handleCreateCollection = () => {
        if (!newName.trim()) return;

        const collection: CollectionItem = {
            id: Date.now().toString(),
            name: newName.trim(),
            description: newDescription.trim(),
            modIds: newModIds.split(',').map(id => id.trim()).filter(Boolean),
            tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt: new Date(),
        };

        const updated = [...collections, collection];
        setCollections(updated);
        saveCollections(updated);
        toast.success(`Collection "${collection.name}" created`);
        setDialogOpen(false);
        resetForm();
    };

    const handleDeleteCollection = (id: string) => {
        const updated = collections.filter(c => c.id !== id);
        setCollections(updated);
        saveCollections(updated);
        toast.success("Collection deleted");
    };

    const handleCopyModIds = (modIds: string[]) => {
        navigator.clipboard.writeText(modIds.join(', '));
        toast.success("Mod IDs copied to clipboard");
    };

    const resetForm = () => {
        setNewName("");
        setNewDescription("");
        setNewModIds("");
        setNewTags("");
    };

    const filteredCollections = collections.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{xs: 'stretch', sm: 'center'}} spacing={2}>
                <Stack>
                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: '#f1f5f9'}}>
                        Mod Collections
                    </Typography>
                    <Typography variant="caption" sx={{color: '#64748b'}}>
                        Organize mods into reusable collections. Save your favorite mod combinations for quick access.
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setDialogOpen(true)}
                    sx={{flexShrink: 0}}
                >
                    New Collection
                </Button>
            </Stack>

            {/* Search */}
            <TextField
                size="small"
                placeholder="Search collections by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{color: '#64748b', fontSize: '1.1rem'}}/>
                        </InputAdornment>
                    ),
                }}
                sx={{maxWidth: 400}}
            />

            {/* Collections Grid */}
            {filteredCollections.length === 0 ? (
                <Box
                    sx={{
                        p: 5,
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.4)',
                        border: '1px solid rgba(148, 163, 184, 0.06)',
                        textAlign: 'center',
                    }}
                >
                    <BookmarkIcon sx={{fontSize: '2.5rem', color: '#334155', mb: 1.5}}/>
                    <Typography variant="body1" sx={{color: '#64748b', mb: 0.5}}>
                        {searchQuery ? 'No collections match your search' : 'No collections yet'}
                    </Typography>
                    <Typography variant="caption" sx={{color: '#475569'}}>
                        Create a collection to group your favorite mods together
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredCollections.map((collection) => (
                        <Grid item xs={12} md={6} key={collection.id}>
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: '12px',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid rgba(148, 163, 184, 0.08)',
                                    transition: 'all 250ms ease',
                                    height: '100%',
                                    '&:hover': {
                                        borderColor: 'rgba(129, 140, 248, 0.2)',
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Stack spacing={0.25} sx={{flex: 1, minWidth: 0}}>
                                            <Typography variant="subtitle2" sx={{fontWeight: 600, color: '#f1f5f9'}}>
                                                {collection.name}
                                            </Typography>
                                            {collection.description && (
                                                <Typography variant="caption" sx={{color: '#64748b', fontSize: '0.75rem'}}>
                                                    {collection.description}
                                                </Typography>
                                            )}
                                        </Stack>
                                        <Stack direction="row" spacing={0.25}>
                                            <Tooltip title="Copy Mod IDs" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleCopyModIds(collection.modIds)}
                                                    sx={{color: '#64748b', '&:hover': {color: '#38bdf8'}}}
                                                >
                                                    <ContentCopyIcon sx={{fontSize: '0.95rem'}}/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteCollection(collection.id)}
                                                    sx={{color: '#64748b', '&:hover': {color: '#ef4444'}}}
                                                >
                                                    <DeleteIcon sx={{fontSize: '0.95rem'}}/>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>

                                    {/* Mod count */}
                                    <Stack direction="row" alignItems="center" spacing={0.75}>
                                        <ExtensionIcon sx={{fontSize: '0.9rem', color: '#818cf8'}}/>
                                        <Typography variant="caption" sx={{color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem'}}>
                                            {collection.modIds.length} mod{collection.modIds.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </Stack>

                                    {/* Mod IDs */}
                                    {collection.modIds.length > 0 && (
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(148, 163, 184, 0.04)',
                                                maxHeight: 80,
                                                overflow: 'auto',
                                            }}
                                        >
                                            <Typography sx={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: '0.7rem',
                                                color: '#00e87b',
                                                lineHeight: 1.6,
                                                wordBreak: 'break-all',
                                            }}>
                                                {collection.modIds.join(', ')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Tags */}
                                    {collection.tags.length > 0 && (
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                            {collection.tags.map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        height: 22,
                                                        backgroundColor: 'rgba(148, 163, 184, 0.08)',
                                                        color: '#94a3b8',
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    )}

                                    {/* Date */}
                                    <Typography variant="caption" sx={{color: '#475569', fontSize: '0.65rem'}}>
                                        Created {new Date(collection.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Collection Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{fontWeight: 600}}>Create New Collection</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{mt: 1}}>
                        <TextField
                            label="Collection Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            fullWidth
                            required
                            placeholder="e.g. Milsim Essentials"
                        />
                        <TextField
                            label="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="What is this collection for?"
                        />
                        <TextField
                            label="Mod IDs"
                            value={newModIds}
                            onChange={(e) => setNewModIds(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Enter mod IDs separated by commas (e.g. 12345, 67890, 11111)"
                            helperText="Paste Steam Workshop mod IDs, separated by commas"
                        />
                        <TextField
                            label="Tags"
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                            fullWidth
                            placeholder="milsim, weapons, vehicles"
                            helperText="Optional tags for organizing, separated by commas"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{px: 3, pb: 2}}>
                    <Button onClick={() => {setDialogOpen(false); resetForm();}} sx={{color: '#94a3b8'}}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleCreateCollection} disabled={!newName.trim()}>
                        Create Collection
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
