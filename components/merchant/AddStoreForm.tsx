"use client";

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { FormEvent } from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddStoreForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [bannerImageUrl, setBannerImageUrl] = useState('');
    const [city, setCity] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/addstore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    bannerImageUrl,
                    city,
                }),
            });

            if (response.ok) {
                setSnackbarMessage('Store added successfully');
                setSnackbarSeverity('success');
                setName('');
                setDescription('');
                setBannerImageUrl('');
                setCity('');
            } else {
                throw new Error('Failed to add store');
            }
        } catch (error) {
            setSnackbarMessage('Failed to add store');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const { url } = await response.json();
                setBannerImageUrl(url);
                setSnackbarMessage('Image uploaded successfully');
                setSnackbarSeverity('success');
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            setSnackbarMessage('Failed to upload image');
            setSnackbarSeverity('error');
        } finally {
            setIsUploading(false);
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Add New Store
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Store Name"
                            variant="outlined"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span" disabled={isUploading}>
                                {isUploading ? <CircularProgress size={24} /> : 'Upload Banner Image'}
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Banner Image URL"
                            variant="outlined"
                            fullWidth
                            value={bannerImageUrl}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="City"
                            variant="outlined"
                            fullWidth
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Add Store
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}