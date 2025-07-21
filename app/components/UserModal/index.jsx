// app/components/UserModal/index.jsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './UserModal.module.css';

const UserModal = ({ user, isLoading, onClose, onUserUpdated, onUserDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    if (user) {
        console.log('UserModal user:', user); // 👈 실제 user 객체 확인
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('사용자 정보가 성공적으로 수정되었습니다.');
        setIsEditing(false);
        onUserUpdated();
      } else {
        alert(result.message || '사용자 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 정보 수정 오류:', error);
      alert('사용자 정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?\n삭제된 사용자는 복구할 수 없습니다.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        alert('사용자가 성공적으로 삭제되었습니다.');
        onUserDeleted();
      } else {
        alert(result.message || '사용자 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      alert('사용자 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>사용자 정보</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div className={styles.loading}>
              <p>사용자 정보를 불러오는 중...</p>
            </div>
          ) : !user ? (
            <div className={styles.error}>
              <p>사용자 정보를 불러올 수 없습니다.</p>
            </div>
          ) : (
            <div className={styles.userInfo}>
              {!isEditing ? (
                // 조회 모드
                <div className={styles.viewMode}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>사용자 ID</label>
                      <span>{user.id}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>이름</label>
                      <span>{user.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>이메일</label>
                      <span>{user.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>역할</label>
                      <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.admin : styles.user}`}>
                        {user.role === 'admin' ? '관리자' : '사용자'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>가입일</label>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>상태</label>
                      <span className={styles.statusBadge}>활성</span>
                    </div>
                  </div>
                </div>
              ) : (
                // 수정 모드
                <form onSubmit={handleSubmit} className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">이름 *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">이메일 *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="role">역할</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="user">사용자</option>
                      <option value="admin">관리자</option>
                    </select>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {!isEditing ? (
            // 조회 모드 버튼들
            <div className={styles.viewButtons}>
              <button 
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
                disabled={isSubmitting}
              >
                ✏️ 수정
              </button>
              <button 
                className={styles.deleteButton}
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                🗑️ 삭제
              </button>
              <button 
                className={styles.cancelButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                닫기
              </button>
            </div>
          ) : (
            // 수정 모드 버튼들
            <div className={styles.editButtons}>
              <button 
                type="submit"
                className={styles.saveButton}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '💾 저장'}
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;