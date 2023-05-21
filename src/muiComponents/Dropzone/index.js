import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactS3Uploader from 'components/ReactS3Uploader';
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from 'api'
import { nanoid } from '@reduxjs/toolkit';
import uploadIcon from 'assets/svg/ico-upload.svg';
import { Typography } from "@mui/material";

export default ({ disabled = false, value, info = true, onUpload }) => {
    const [url, setUrl] = useState(null)
    const [droppedfiles, setDroppedfiles] = useState([])
    const [uploadLoading, setUploadLoading] = useState(null)
    const onDrop = useCallback(acceptedFiles => setDroppedfiles(acceptedFiles), [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })

    useEffect(() => {
        setUrl(value)
    }, [value])

    const getSignedUploadUrl = (file, callback) => {
        if(disabled) return;
        const filename = `SBT/${nanoid(32)}.${file.type.split('/')[1]}`
        return axiosHttp.post(`utility/upload-url`, { key: filename, mime: file.type }).then(res => callback(res.data))
    }

    const onUploadProgress = (progress, message, file) => { }

    const onUploadError = error => { setDroppedfiles([]); setUploadLoading(false) }

    const onUploadStart = (file, next) => { if(disabled) return; setUploadLoading(true); return next(file); }

    const onFinish = finish => {
        setDroppedfiles([])
        setUploadLoading(false);
        var arr = finish.signedUrl.split('?');
        onUpload(arr[0])
        setUrl(arr[0])
    }

    return (
        <div {...getRootProps()} disabled={disabled}>
            <ReactS3Uploader
                droppedfiles={droppedfiles}
                getSignedUrl={getSignedUploadUrl}
                accept="image/png,image/jpeg,image/jpg"
                className={{ display: 'none' }}
                onProgress={onUploadProgress}
                onError={onUploadError}
                preprocess={onUploadStart}
                onFinish={onFinish}
                multiple
                uploadRequestHeaders={{
                }}
                contentDisposition="auto"
            />
            <div style={{ display: 'flex', borderRadius: 10, margin: '16px 0', height: 200, width: 200, backgroundColor: '#F5F5F5', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {uploadLoading ?
                    <LeapFrog size={24} color="#C94B32" /> :
                    <>
                        {!url ?
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <img style={{ marginBottom: 32 }} src={uploadIcon} alt="upload-icon" />
                                <Typography style={{ textAlign: 'center', color: '#1B2D41', opacity: 0.6, fontSise: 16 }} variant='subtitle2'>Choose <br /> or drag an image</Typography>
                                <Typography style={{ color: '#1B2D41', opacity: 0.2, fontSise: 14 }} variant='body2'>maximum size 2mb</Typography>
                            </div> :
                            <img src={url} style={{ objectFit: 'contain', height: 200, width: 200, borderRadius: 10, backgroundColor: "rgba(234, 100, 71, 0.1)" }}></img>
                        }
                    </>
                }
            </div>
            <input {...getInputProps()} />
        </div>
    )
}