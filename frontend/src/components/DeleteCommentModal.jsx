import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ChevronDown, Loader, X } from 'lucide-react';

const REMOVAL_REASONS = [
  'Spam',
  'Abuse / Violence',
  'Irrelevant',
  'Harassment',
  'Other',
];

/**
 * DeleteCommentModal
 *
 * Props:
 *   isOpen        boolean          — whether the modal is visible
 *   onClose       () => void       — called when user cancels
 *   onConfirm     (reason, msg) => Promise<void>
 *                                  — called with selected reason + optional message
 *   isSubmitting  boolean          — shows spinner while API is in-flight
 */
export function DeleteCommentModal({ isOpen, onClose, onConfirm, isSubmitting }) {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  // Reset form each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setMessage('');
      setValidationError('');
      // Focus the first interactive element for accessibility
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, isSubmitting, onClose]);

  // Trap body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!reason) {
      setValidationError('Please select a reason for removal.');
      return;
    }
    setValidationError('');
    await onConfirm(reason, message.trim() || undefined);
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="delete-modal-backdrop"
      onClick={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      ref={dialogRef}
    >
      <div className="delete-modal-panel">
        {/* Header */}
        <div className="delete-modal-header">
          <div className="delete-modal-icon-wrap">
            <AlertTriangle className="delete-modal-icon" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="delete-modal-eyebrow">Editorial action</p>
            <h2 id="delete-modal-title" className="delete-modal-title">Remove Comment</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cancel"
            className="delete-modal-close-btn"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="delete-modal-body">
            <p className="delete-modal-info">
              The comment owner will receive a notification with your reason. This action will be
              recorded for moderation purposes.
            </p>

            {/* Reason dropdown */}
            <div className="delete-modal-field">
              <label htmlFor="delete-reason" className="delete-modal-label">
                Reason for removal <span aria-hidden="true" style={{ color: '#CC0000' }}>*</span>
              </label>
              <div className="delete-modal-select-wrap">
                <select
                  id="delete-reason"
                  ref={firstInputRef}
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    if (event.target.value) setValidationError('');
                  }}
                  className="delete-modal-select"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? 'reason-error' : undefined}
                >
                  <option value="">— Select a reason —</option>
                  {REMOVAL_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="delete-modal-select-icon" strokeWidth={1.5} />
              </div>
              {validationError && (
                <p id="reason-error" className="delete-modal-error" role="alert">
                  {validationError}
                </p>
              )}
            </div>

            {/* Optional message */}
            <div className="delete-modal-field">
              <label htmlFor="delete-message" className="delete-modal-label">
                Additional explanation <span className="delete-modal-optional">(optional)</span>
              </label>
              <textarea
                id="delete-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Provide further context for this decision…"
                maxLength={500}
                rows={3}
                className="delete-modal-textarea"
              />
              <p className="delete-modal-char-count">{message.length}/500</p>
            </div>
          </div>

          {/* Footer */}
          <div className="delete-modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="delete-modal-submit-btn"
            >
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
              )}
              {isSubmitting ? 'Removing…' : 'Remove Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
