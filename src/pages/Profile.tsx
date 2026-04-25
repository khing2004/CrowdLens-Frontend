import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

interface ProfileData {
  username: string;
  email: string;
  pronouns: string;
  address: string;
  birthday: string;
  bio: string;
  avatar: string;
}

const PRONOUNS_OPTIONS = [
  "He/Him",
  "She/Her",
  "They/Them",
  "He/They",
  "She/They",
  "Prefer not to say",
  "Other",
];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData>({
    username: user?.name ?? "",
    email: user?.email ?? "",
    pronouns: "Prefer not to say",
    address: "",
    birthday: "",
    bio: "This is a sample bio for the user. It can be edited in the profile settings.",
    avatar: "/Logo.png",
  });

  const [draft, setDraft] = useState<ProfileData>({ ...profile });
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setDraft((prev) => ({ ...prev, avatar: url }));
    setSaved(false);
  };

  const handleSave = () => {
    setProfile({ ...draft });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => {
    setDraft({ ...profile });
    setAvatarPreview(null);
    setSaved(false);
  };

  const isDirty = JSON.stringify(draft) !== JSON.stringify(profile);

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-topbar">
        <button className="back-btn" onClick={() => navigate("/settings")}>
          ‹ Back
        </button>
        <h1 className="profile-topbar-title">Edit Profile</h1>
        <div style={{ width: 60 }} />
      </div>

      {/* Avatar */}
      <div className="avatar-section">
        <div className="avatar-ring">
          <img
            src={avatarPreview ?? draft.avatar}
            alt="Profile"
            className="avatar-img"
          />
          <button className="avatar-edit-btn" onClick={handleAvatarClick}>
            <span className="camera-icon">📷</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
        <p className="avatar-hint">Tap photo to change</p>
      </div>

      {/* Form */}
      <div className="profile-form">
        {/* Identity */}
        <div className="form-section">
          <p className="form-section-label">Identity</p>

          <div className="field-group">
            <label className="field-label">Username</label>
            <input
              className="field-input"
              type="text"
              name="username"
              value={draft.username}
              onChange={handleChange}
              placeholder="Your display name"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Pronouns</label>
            <select
              className="field-input field-select"
              name="pronouns"
              value={draft.pronouns}
              onChange={handleChange}
            >
              {PRONOUNS_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Bio</label>
            <textarea
              className="field-input field-textarea"
              name="bio"
              value={draft.bio}
              onChange={handleChange}
              placeholder="Tell the community a little about yourself…"
              rows={3}
              maxLength={180}
            />
            <p className="field-hint">{draft.bio.length}/180</p>
          </div>
        </div>

        {/* Contact */}
        <div className="form-section">
          <p className="form-section-label">Contact</p>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              name="email"
              value={draft.email}
              onChange={handleChange}
              placeholder="hello@example.com"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Address</label>
            <input
              className="field-input"
              type="text"
              name="address"
              value={draft.address}
              onChange={handleChange}
              placeholder="City, Province"
            />
          </div>
        </div>

        {/* Personal */}
        <div className="form-section">
          <p className="form-section-label">Personal</p>

          <div className="field-group">
            <label className="field-label">Birthday</label>
            <input
              className="field-input"
              type="date"
              name="birthday"
              value={draft.birthday}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={!isDirty}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
          {isDirty && (
            <button className="discard-btn" onClick={handleDiscard}>
              Discard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
