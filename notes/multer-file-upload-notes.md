# File Uploading with Multer in Express.js

> Student Notes — Covers Multer setup, file system & database storage, pros/cons, and serving static files with `express.static`

---

## 1. What is Multer?

Multer is a Node.js middleware for handling `multipart/form-data`, the encoding type used when uploading files via HTML forms. It is built on top of `busboy` and integrates directly into Express.js routes.

**Request flow:**
```
HTML Form → Express Route → Multer Middleware → req.file / req.files
```

> ⚠️ Multer only processes `multipart/form-data`. Always set `enctype="multipart/form-data"` on your HTML form.

---

## 2. Installation & Basic Setup

```bash
npm install multer
```

### Minimal Example

```js
const express = require('express');
const multer  = require('multer');

const app    = express();
const upload = multer({ dest: 'uploads/' }); // simple disk destination

// single file — field name must match HTML input name=""
app.post('/upload', upload.single('avatar'), (req, res) => {
  console.log(req.file);   // file metadata object
  res.send('Upload successful');
});

app.listen(3000);
```

### HTML Form

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="avatar" />
  <button type="submit">Upload</button>
</form>
```

---

## 3. Key Multer Methods

| Method | Description |
|--------|-------------|
| `upload.single('field')` | Accepts one file from the named field |
| `upload.array('field', max)` | Accepts multiple files from one field (up to `max`) |
| `upload.fields([...])` | Accepts files from multiple named fields |
| `upload.none()` | Only text fields — no file upload allowed |

### `upload.fields()` example

```js
upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
])
// Access via: req.files['avatar'][0] and req.files['gallery']
```

---

## 4. Storage Engines

Multer ships with two built-in storage engines configured when creating the `multer()` instance.

---

## 5. Approach A — File System Storage

### Using `multer.diskStorage()`

```js
const path    = require('path');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');              // folder to save file
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext    = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

const upload = multer({ storage });

app.post('/profile', upload.single('photo'), (req, res) => {
  res.json({
    message : 'Saved!',
    filename: req.file.filename,
    path    : req.file.path,
  });
});
```

### `req.file` Properties (diskStorage)

| Property | Description |
|----------|-------------|
| `fieldname` | Field name from the form |
| `originalname` | Original filename from the client |
| `encoding` | Encoding type |
| `mimetype` | MIME type (e.g. `image/jpeg`) |
| `size` | File size in bytes |
| `destination` | Folder where file was saved |
| `filename` | Name of the file inside destination |
| `path` | Full path to the saved file |

---

### Pros of File System Storage

- ✅ Simple setup — files land on disk with no extra dependencies
- ✅ Fast reads — OS handles file I/O efficiently
- ✅ Streaming-friendly — large files (video, zip) stay off RAM
- ✅ Easy to serve via CDN or reverse proxy (Nginx, S3)
- ✅ No database bloat — only metadata stored in DB

### Cons of File System Storage

- ❌ Hard to scale — files live on one server's disk
- ❌ File sync needed across multiple server instances
- ❌ Disk can fill up; requires monitoring and cleanup
- ❌ Security risk if `uploads/` is publicly accessible without access control
- ❌ No built-in per-file access control

---

## 6. Serving Uploaded Files — `express.static`

### What is `express.static`?

`express.static` is a built-in Express middleware that serves static files (HTML, CSS, images, uploaded files) directly from a directory on your server.

### Basic Usage

```js
// Serve all files inside the 'uploads' folder at the /uploads URL path
app.use('/uploads', express.static('uploads'));

// Now a file saved at uploads/photo-123.jpg is accessible at:
// http://localhost:3000/uploads/photo-123.jpg
```

### Full Upload + Serve Example

```js
const express = require('express');
const multer  = require('multer');
const path    = require('path');

const app = express();

// 1. Serve uploaded files as static assets
app.use('/uploads', express.static('uploads'));

// 2. Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 3. Upload route
app.post('/upload', upload.single('photo'), (req, res) => {
  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({
    message : 'Uploaded!',
    filename: req.file.filename,
    url     : fileUrl,
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### `express.static` Options

```js
app.use('/uploads', express.static('uploads', {
  maxAge    : '1d',        // Cache files for 1 day in browser
  etag      : true,        // Enable ETag for cache validation
  index     : false,       // Disable directory index listing (security)
  dotfiles  : 'deny',      // Block access to dotfiles like .env
}));
```

| Option | Description |
|--------|-------------|
| `maxAge` | Browser cache duration (e.g. `'1d'`, `'7d'`, `86400000`) |
| `etag` | Enable/disable ETag header |
| `index` | Serve `index.html` automatically — set `false` to prevent directory listing |
| `dotfiles` | `'deny'` blocks `.env`, `.htaccess` etc. |

> ⚠️ **Security tip:** Always set `index: false` and `dotfiles: 'deny'` when serving user-uploaded files to prevent directory browsing and accidental exposure of hidden files.

### Serving Other Static Assets

```js
// Serve frontend build files
app.use(express.static('public'));

// Serve from multiple directories
app.use(express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));
```

---

## 7. Approach B — Database Storage (Binary)

### Using `multer.memoryStorage()` + MongoDB

```js
const storage = multer.memoryStorage();  // file kept in memory as Buffer
const upload  = multer({ storage });

// Mongoose model
const FileSchema = new mongoose.Schema({
  filename   : String,
  contentType: String,
  data       : Buffer,                    // raw binary data
  uploadedAt : { type: Date, default: Date.now }
});
const FileModel = mongoose.model('File', FileSchema);

// Upload and save to DB
app.post('/upload', upload.single('document'), async (req, res) => {
  const file = new FileModel({
    filename   : req.file.originalname,
    contentType: req.file.mimetype,
    data       : req.file.buffer,         // Buffer from memoryStorage
  });
  await file.save();
  res.json({ id: file._id, message: 'Stored in DB!' });
});

// Retrieve and stream back to client
app.get('/file/:id', async (req, res) => {
  const file = await FileModel.findById(req.params.id);
  res.set('Content-Type', file.contentType);
  res.send(file.data);
});
```

> 📝 For SQL databases (PostgreSQL / MySQL) use a `BYTEA` or `LONGBLOB` column. The pattern is the same — read `req.file.buffer` and insert it.

### `req.file` Properties (memoryStorage)

| Property | Description |
|----------|-------------|
| `fieldname` | Field name from the form |
| `originalname` | Original filename |
| `mimetype` | MIME type |
| `size` | File size in bytes |
| `buffer` | The file data as a Node.js `Buffer` |

> ⚠️ `destination`, `filename`, and `path` are **not available** in memoryStorage.

---

### Pros of Database Storage

- ✅ Atomic transactions — file and metadata saved together
- ✅ Easy backups — DB backup automatically includes files
- ✅ Scales horizontally with DB replication
- ✅ Access control via DB query / middleware
- ✅ No orphaned files when records are deleted

### Cons of Database Storage

- ❌ Entire file loaded into RAM via `memoryStorage`
- ❌ DB size bloat — slow queries over large binary columns
- ❌ Not suitable for large files (video, archives)
- ❌ Cannot use CDN caching easily
- ❌ Higher DB resource and storage cost

---

## 8. Side-by-Side Comparison

| Factor | File System | Database |
|--------|-------------|----------|
| Large files (video, PDF) | ✅ Excellent | ❌ Poor |
| Small files (icons, sigs) | ✅ Good | ✅ Works well |
| Multi-server deployment | ❌ Needs sync | ✅ Built-in |
| CDN / caching support | ✅ Easy | ❌ Complex |
| Atomic backup with data | ❌ Separate step | ✅ Included in DB |
| Per-file access control | ❌ Manual | ✅ Via query |
| RAM usage during upload | ✅ Streamed | ❌ Buffered in RAM |
| Setup complexity | ✅ Simple | ⚠️ Moderate |

---

## 9. File Validation & Size Limits

```js
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,    // max 5 MB per file
    files   : 3,                   // max 3 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);              // accept file
    } else {
      cb(new Error('Only JPEG, PNG and PDF are allowed'), false); // reject
    }
  }
});
```

> ⚠️ **Never trust `file.mimetype` alone.** It is sent by the client and can be spoofed. Use a library like [`file-type`](https://www.npmjs.com/package/file-type) to inspect the actual file buffer on the server side.

---

## 10. Error Handling

```js
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Custom fileFilter errors or other issues
      return res.status(400).json({ error: err.message });
    }
    // Success
    res.json({ file: req.file });
  });
});
```

### Common `MulterError` Codes

| Code | Cause |
|------|-------|
| `LIMIT_FILE_SIZE` | File exceeds `limits.fileSize` |
| `LIMIT_FILE_COUNT` | Too many files in the request |
| `LIMIT_UNEXPECTED_FILE` | Field name not expected by the middleware |
| `LIMIT_FIELD_VALUE` | Field value too long |

---

## 11. Production Best Practice — Cloud Storage (Hybrid Approach)

In real-world apps, most teams combine both approaches:

1. Upload file to cloud storage (AWS S3, Google Cloud Storage, Cloudinary)
2. Save only the file **URL or key** in the database

```
Client → Express + Multer → Cloud Storage (S3)
                          → Database (save URL/key only)
```

**Benefits:**
- Files served via CDN globally
- Database stays lean (strings only)
- Scalable to millions of files
- Access control via signed URLs

---

## 12. When to Use Which?

### Use File System when…
- Files are large (images, video, PDF documents)
- You need CDN or caching integration
- Running on a single server or using cloud storage (S3/GCS)
- Performance and throughput matter

### Use Database when…
- Files are small (icons, signatures, thumbnails)
- Strict per-record access control is needed
- Atomic save (file + metadata together) is required
- Simplicity is more important than scalability

---

## 13. Quick Reference Card

```
multer({ dest })            → quick setup, random filenames
multer.diskStorage()        → custom filename + destination
multer.memoryStorage()      → file as Buffer in req.file.buffer

upload.single('name')       → req.file
upload.array('name', max)   → req.files (array)
upload.fields([...])        → req.files (object by field name)

express.static('uploads')   → serve files from disk at a URL path
```

---

*Notes compiled for Express.js + Multer v1.x | Node.js 18+*
