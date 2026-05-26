import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X as XIcon, Info as InfoIcon, Loader2 } from "lucide-react";
import { postsApi } from "../api/postsApi";

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreatePostModal({ open, onClose, onSubmit, theme, posts = [] }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [domain, setDomain] = useState("");
  const [domainQuery, setDomainQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const[submitLoading, setSubmitLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const tagInputRef = useRef(null);

  const domains = useMemo(() => {
    const set = new Set();
    (posts || []).forEach((p) => {
      if (p.domain) set.add(p.domain);
    });
    return Array.from(set);
  }, [posts]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }
  }, [coverFile]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setAuthor("");
      setDomain("");
      setDomainQuery("");
      setTags([]);
      setTagInput("");
      setSummary("");
      setContent("");
      setCoverFile(null);
    }
  }, [open]);

  function addTagFromInput() {
    const t = tagInput.trim().replace(/^,+|,+$/g, "");
    if (t && !tags.includes(t)) setTags((s) => [...s, t]);
    setTagInput("");
  }

  function handleTagKeyDown(e) {
    if (e.key === " " || e.key === ",") {
      e.preventDefault();
      addTagFromInput();
    } else if (e.key === "Backspace" && tagInput === "") {
      e.preventDefault();
      setTags((s) => s.slice(0, -1));
    }
  }

  const suggestedDomains = useMemo(() => {
    const q = domainQuery.trim().toLowerCase();
    const dq = domains.filter((d) => d.toLowerCase().includes(q));
    if (!q) return domains;
    for (const d of dq) {
        if (domainQuery === d) {
            return [];
        }
    }
    return dq;
  }, [domains, domainQuery]);

  function handleAttachImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    (async () => {
      setUploading(true);
      try {
        const uploaded = await uploadToCloudinary(file);
        setContent((c) => `${c}\n\n![${file.name}](${uploaded})\n`);
      } catch (err) {
        console.error(err);
        alert("Image upload failed. Using local preview instead.");
        const url = URL.createObjectURL(file);
        setContent((c) => `${c}\n\n![${file.name}](${url})\n`);
      } finally {
        setUploading(false);
      }
    })();
  }


  async function uploadToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary config missing (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)");
    }
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed: ${res.status} ${text}`);
    }
    const data = await res.json();
    return data.secure_url || data.url;
  }

  function validateAndSubmit() {
    if (!title.trim()) return alert("Title is required");
    if (!coverFile) return alert("Cover image is required");
    setSubmitLoading(true);
    const payload = {
      id: slugify(title),
      title: title.trim(),
      author: author.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
      domain: domain.trim() || undefined,
      tags,
      summary: summary.trim(),
      cover: coverPreview || "",
      content,
    };
    postsApi.createPost(payload).then((data) => {
      onSubmit(payload);
      location.reload();
    }).catch((err) => {
      console.error(err);
      alert("Failed to create post");
    }).finally(() => {
        setSubmitLoading(false);
    }); 
  }

  async function handleCoverChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      setCoverFile(file);
      setCoverPreview(uploaded);
    } catch (err) {
      console.error(err);
      alert("Cover upload failed. Using local preview instead.");
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  const mdComponents = {
    h1: ({ node, ...props }) => <h1 className="font-bold text-2xl" {...props} />,
    h2: ({ node, ...props }) => <h2 className="font-bold text-xl" {...props} />,
    h3: ({ node, ...props }) => <h3 className="font-bold text-lg" {...props} />,
    h4: ({ node, ...props }) => <h4 className="font-bold" {...props} />,
    h5: ({ node, ...props }) => <h5 className="font-bold" {...props} />,
    h6: ({ node, ...props }) => <h6 className="font-bold" {...props} />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-3xl mx-4 rounded-lg p-6 shadow-lg overflow-auto no-scrollbar ${theme === 'dark' ? 'bg-black/85 text-white' : 'bg-white text-black'} animate-slide-in`} style={{maxHeight: '90vh'}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Post (Experimental)</h3>
          <button onClick={onClose} className="opacity-80 hover:scale-110"><XIcon /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2 bg-transparent" />
          </div>

          <div className="grid w-full">
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded border px-3 py-2 bg-transparent" />
            </div>
            </div>
            <div className="grid w-full">
            <div>
              <label className="block text-sm font-medium mb-1">Domain</label>
              <input value={domainQuery} onChange={(e) => { setDomainQuery(e.target.value); setDomain(e.target.value); }} className="w-full rounded border px-3 py-2 bg-transparent" />
              {suggestedDomains.length > 0 && domainQuery.length > 0 && (
                <div className={`mt-1 rounded border bg-panel/20 p-1 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/90'}`}>
                  {suggestedDomains.map((d) => (
                    <div key={d} className="px-2 py-1 text-sm hover:cursor-pointer hover:bg-slate-200/20" onClick={() => { setDomain(d); setDomainQuery(d); }}>
                      {d}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className={`flex items-center gap-2 flex-wrap rounded border px-2 py-1 ${theme === 'dark' ? 'bg-black/50' : 'bg-white'}`} onClick={() => tagInputRef.current?.focus()}>
              {tags.map((t) => (
                <div key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/30 text-sm">
                  <span>{t}</span>
                  <button onClick={(e) => { e.stopPropagation(); setTags((s) => s.filter((x) => x !== t)); }} className="ml-1">×</button>
                </div>
              ))}
              <input
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTagFromInput}
                className="flex-1 min-w-[120px] px-2 py-1 bg-transparent outline-none"
                placeholder="Add tags (comma or space)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <input value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={200} className="w-full rounded border px-3 py-2 bg-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full rounded border px-3 py-2 bg-transparent" />
            <div className="justify-between flex items-center mt-1 relative">
            <div className="flex items-center gap-2 mt-2">
              <label className="text-sm">Attach image:</label>
              <input type="file" accept="image/*" onChange={handleAttachImage} />
            </div>
            <InfoIcon
              className="size-4 text-muted hover:cursor-pointer"
              onClick={() => setShowTips(true)}
              title="You can also attach images by typing ![alt text](image_url) in the content. The image URL can be a link to an existing image or a local file URL created by the attach image button."
            />

            {showTips && (
              <div
                className={`absolute right-0 bottom-full mb-2 w-80 p-3 rounded border shadow-lg z-50 ${theme === 'dark' ? 'bg-black/85 text-white' : 'bg-white text-black'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold">Markdown Tips</div>
                  <button className="ml-2 opacity-80" onClick={() => setShowTips(false)}><XIcon /></button>
                </div>
                <div className="mt-2 text-sm space-y-2">
                  <div><code># Heading 1</code> → large bold heading</div>
                  <div><code>## Heading 2</code> → medium bold heading</div>
                  <div><code>### Heading 3</code> → smaller bold heading</div>
                  <div>New paragraphs: separate lines with a blank line, or use <code>\n</code> which will be normalized in the preview.</div>
                  <div>Images: <code>![alt text](image_url)</code></div>
                  <div>Lists, links, code fences, and tables are supported via GitHub-flavored Markdown.</div>
                </div>
              </div>
            )}
            </div>
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Preview</div>
              <div className={`prose max-w-full p-3 rounded border max-h-[480px] overflow-auto ${theme === 'dark' ? 'prose-invert bg-black/60' : 'bg-white/50'}`}>
                <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>{(content || "_(empty)_").replace(/\\n/g, "\n")}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Image (required)</label>
            <input type="file" accept="image/*" onChange={(e) => handleCoverChange(e)} />
            {coverPreview && <img src={coverPreview} alt="cover preview" className="mt-2 w-48 h-auto rounded" />}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded">Cancel</button>
            <button onClick={validateAndSubmit} className="px-4 py-2 rounded bg-cyan-600 text-white">Submit</button>
          </div>
        </div>
      </div>
      {uploading && (
        <div className="absolute inset-0 z-60 flex items-center justify-center">
          <div className="w-40 h-40 rounded-lg flex flex-col items-center justify-center bg-white/90 dark:bg-black/80 shadow-lg">
            <Loader2 className="animate-spin" />
            <div className="mt-2 text-sm">Uploading...</div>
          </div>
        </div>
      )}
    </div>
  );
}
