import React, { useState } from 'react';
import styles from './AddressModal.module.css';

const AddressModal = ({ isOpen, onClose, onAddressAdded }) => {
  const [form, setForm] = useState({
    name: '',
    recipient: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        alert('주소가 등록되었습니다.');
        onAddressAdded?.();
        onClose();
      } else {
        alert(result.message || '주소 등록에 실패했습니다.');
      }
    } catch (err) {
      alert('주소 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>주소 추가</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            주소명
            <input className={styles.input} name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label className={styles.label}>
            받는 사람
            <input className={styles.input} name="recipient" value={form.recipient} onChange={handleChange} required />
          </label>
          <label className={styles.label}>
            연락처
            <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} required />
          </label>
          <label className={styles.label}>
            우편번호
            <input className={styles.input} name="zipcode" value={form.zipcode} onChange={handleChange} required />
          </label>
          <label className={styles.label}>
            주소
            <input className={styles.input} name="address" value={form.address} onChange={handleChange} required />
          </label>
          <label className={styles.label}>
            상세주소
            <input className={styles.input} name="detailAddress" value={form.detailAddress} onChange={handleChange} />
          </label>
          <label className={styles.label}>
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            기본 배송지로 설정
          </label>
          <div className={styles.actions}>
            <button className={styles.modalButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
            <button className={styles.modalButton} type="button" onClick={onClose} disabled={isSubmitting}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;