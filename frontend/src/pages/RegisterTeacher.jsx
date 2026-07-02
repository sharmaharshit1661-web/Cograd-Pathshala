import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

import {
  User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, GraduationCap,
  BookOpen, Calendar, X, Upload, FileText, Trash2, AlertCircle,
} from 'lucide-react';

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
];

const EXPERIENCE_OPTIONS = ['0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years'];

const DOC_TYPES = [
  {
    id: 'degree',
    label: 'Degree / Qualification Certificate',
    hint: 'Upload your highest academic certificate (PDF, JPG, PNG)',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'id_proof',
    label: 'Government ID Proof',
    hint: 'Aadhar Card, PAN Card, or Passport (PDF, JPG, PNG)',
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  {
    id: 'experience_letter',
    label: 'Experience Letter / Reference',
    hint: 'Optional — previous employer or institution letter (PDF)',
    required: false,
    accept: '.pdf,.jpg,.jpeg,.png',
  },
];

const MAX_FILE_SIZE_MB = 5;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ── Single upload zone ── */
const UploadZone = ({ doc, file, onFile, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = (f) => {
    if (!f) return '';
    const ext = f.name.split('.').pop().toLowerCase();
    const allowed = doc.accept.replace(/\./g, '').split(',');
    if (!allowed.includes(ext)) return `Invalid type. Allowed: ${doc.accept}`;
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `File too large (max ${MAX_FILE_SIZE_MB} MB)`;
    return '';
  };

  const handleFile = (f) => {
    const err = validate(f);
    setError(err);
    if (!err) onFile(doc.id, f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-semibold text-neutral-700">
          {doc.label}
          {doc.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      </div>
      <p className="text-xs text-neutral-400 mb-2">{doc.hint}</p>

      {file ? (
        /* Uploaded file chip */
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-800 truncate">{file.name}</p>
            <p className="text-[10px] text-emerald-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => { onRemove(doc.id); setError(''); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
            title="Remove file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
            ${dragging
              ? 'border-primary-400 bg-primary-50/60 scale-[1.01]'
              : 'border-neutral-200 bg-neutral-50 hover:border-primary-300 hover:bg-primary-50/30'
            }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
            <Upload className={`w-4.5 h-4.5 transition-colors ${dragging ? 'text-primary-500' : 'text-neutral-400'}`} />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-neutral-600">
              Drag & drop or <span className="text-primary-600">browse</span>
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Max {MAX_FILE_SIZE_MB} MB · {doc.accept}</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={doc.accept}
            className="hidden"
            onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};

/* ── Main Component ── */
const RegisterTeacher = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', qualifications: '', experience: '', bio: '' });
  const [subjects, setSubjects] = useState([]);
  const [docs, setDocs] = useState({});          // { [doc.id]: File }
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleSubject = (s) => setSubjects((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const handleFile = (id, file) => setDocs((p) => ({ ...p, [id]: file }));
  const removeFile  = (id)       => setDocs((p) => { const n = { ...p }; delete n[id]; return n; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjects.length === 0) { alert('Please select at least one subject.'); return; }

    // Validate required docs
    const missingDocs = DOC_TYPES.filter((d) => d.required && !docs[d.id]);
    if (missingDocs.length > 0) {
      alert(`Please upload the required documents:\n• ${missingDocs.map((d) => d.label).join('\n• ')}`);
      return;
    }

    setLoading(true);
    try {
      // Build multipart FormData so actual files are sent to the backend
      const fd = new FormData();
      fd.append('name',            form.name);
      fd.append('email',           form.email);
      fd.append('phone',           form.phone);
      fd.append('role',            'teacher');
      fd.append('qualifications',  form.qualifications);
      fd.append('experience',      form.experience);
      fd.append('bio',             form.bio);
      fd.append('city',            'Meerut');
      // subjects_taught as JSON string (backend spreads extraFields)
      fd.append('subjects_taught', JSON.stringify(subjects));
      fd.append('grade_levels_qualified', JSON.stringify(['Class 9', 'Class 10', 'Class 8', 'Class 7']));

      // Attach each uploaded file under its backend field name
      // doc_degree | doc_id_proof | doc_experience_letter
      const FIELD_MAP = {
        degree:            'doc_degree',
        id_proof:          'doc_id_proof',
        experience_letter: 'doc_experience_letter',
      };
      for (const [docId, file] of Object.entries(docs)) {
        const fieldName = FIELD_MAP[docId];
        if (fieldName && file) fd.append(fieldName, file, file.name);
      }

      // Use raw fetch so we don't accidentally set Content-Type ourselves
      // (browser sets it automatically with the correct multipart boundary)
      const baseUrl = import.meta.env.VITE_API_URL || 'https://cograd-pathshala-ygyi.onrender.com/api';
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        body: fd,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setShowSuccess(true);
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-neutral-900 mb-1.5">Join as a Teacher</h1>
          <p className="text-neutral-500 text-sm">Start your teaching journey and make a meaningful impact</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 no-glass">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Basic Info ── */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label"><User className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Full Name</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder="Your full name" />
                </div>
                <div>
                  <label className="form-label"><Mail className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Email Address</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="form-label"><Phone className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Phone Number</label>
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="form-input" placeholder="10-digit mobile number" />
              </div>
            </div>

            {/* ── Teaching Info ── */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
                Teaching Information
              </h3>

              <div>
                <label className="form-label"><GraduationCap className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Qualifications</label>
                <input type="text" name="qualifications" required value={form.qualifications} onChange={handleChange} className="form-input" placeholder="e.g. M.Sc Mathematics, B.Ed" />
              </div>

              <div>
                <label className="form-label mb-2"><BookOpen className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Subjects (select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 border border-neutral-200 rounded-xl bg-neutral-50 max-h-48 overflow-y-auto">
                  {SUBJECTS.map((s) => {
                    const selected = subjects.includes(s);
                    return (
                      <label key={s} className="flex items-center gap-2 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSubject(s)}
                          className="w-3.5 h-3.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className={`text-xs font-medium select-none transition-colors ${selected ? 'text-primary-700' : 'text-neutral-600'}`}>
                          {s}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {subjects.length > 0 && (
                  <p className="mt-2 text-xs text-emerald-600 font-medium">
                    {subjects.length} subject{subjects.length !== 1 ? 's' : ''} selected: {subjects.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label"><Calendar className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Teaching Experience</label>
                <select name="experience" required value={form.experience} onChange={handleChange} className="form-input bg-white cursor-pointer">
                  <option value="">Select your experience</option>
                  {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label"><BookOpen className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />Professional Bio</label>
                <textarea name="bio" required rows="4" value={form.bio} onChange={handleChange} className="form-input resize-none" placeholder="Tell us about your teaching philosophy and what makes you unique as a mentor…" />
              </div>
            </div>

            {/* ── Document Uploads ── */}
            <div className="space-y-5">
              <div className="pb-3 border-b border-neutral-100">
                <h3 className="text-base font-semibold text-neutral-900">Document Uploads</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Upload supporting documents for verification. Required docs are marked with <span className="text-rose-500">*</span>
                </p>
              </div>

              <div className="space-y-5">
                {DOC_TYPES.map((doc) => (
                  <UploadZone
                    key={doc.id}
                    doc={doc}
                    file={docs[doc.id] || null}
                    onFile={handleFile}
                    onRemove={removeFile}
                  />
                ))}
              </div>

              {/* Upload progress summary */}
              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-neutral-600">
                    {Object.keys(docs).length} / {DOC_TYPES.length} documents uploaded
                  </p>
                  <div className="mt-1.5 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                      style={{ width: `${(Object.keys(docs).length / DOC_TYPES.length) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-primary-600 ml-2">
                  {Math.round((Object.keys(docs).length / DOC_TYPES.length) * 100)}%
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : 'Submit Application'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-800">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-neutral-100 animate-slide-up relative no-glass">
            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer">
              <X className="w-4.5 h-4.5" />
            </button>
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Application Received!</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-5">
              Thank you, <strong className="text-neutral-700">{form.name}</strong>! Your teacher application has been submitted to the admin team. Once verified and approved, your login credentials will be sent to <strong className="text-neutral-700">{form.email}</strong>.
            </p>

            {Object.keys(docs).length > 0 && (
              <div className="bg-neutral-50 rounded-xl p-4 text-left text-sm mb-5 border border-neutral-100">
                <p className="font-semibold text-neutral-800 mb-2 text-xs uppercase tracking-wide">Documents Submitted</p>
                <ul className="space-y-1">
                  {Object.entries(docs).map(([id, f]) => (
                    <li key={id} className="flex items-center gap-2 text-xs text-neutral-500">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-neutral-50 rounded-xl p-4 text-left text-sm mb-5 border border-neutral-100">
              <p className="font-semibold text-neutral-800 mb-2 text-xs uppercase tracking-wide">Next Steps</p>
              <ol className="list-decimal list-inside space-y-1 text-neutral-500 text-xs">
                <li>Admin verification of your qualifications &amp; documents</li>
                <li>Approval and account provisioning</li>
                <li>Login credentials sent to your registered email address</li>
              </ol>
            </div>
            <button onClick={() => { setShowSuccess(false); navigate('/login'); }} className="w-full btn-primary py-3">
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterTeacher;
