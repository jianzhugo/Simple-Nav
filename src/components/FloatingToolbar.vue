<template>
  <div class="ft-toolbar">
    <button
      class="ft-btn"
      @click="goHome"
      title="回到主页"
    >
      <i class="fas fa-home"></i>
    </button>
    <button
      class="ft-btn"
      :class="{ 'ft-btn-active': showPreview }"
      @click="handleTogglePreview"
      :title="showPreview ? '关闭图片预览' : '开启图片预览'"
    >
      <i class="fas fa-image"></i>
    </button>
    <button
      class="ft-btn"
      :class="{ 'ft-btn-active': theme === 'glass' }"
      @click="toggleTheme"
      :title="theme === 'glass' ? '切换为默认主题' : '切换为液态玻璃主题'"
    >
      <i class="fas fa-gem"></i>
    </button>
  </div>
</template>

<script>
export default {
  emits: ['change-theme', 'toggle-preview'],
  props: ['theme', 'showPreview'],
  methods: {
    goHome() {
      this.$router.push('/');
    },
    handleTogglePreview() {
      this.$emit('toggle-preview');
    },
    toggleTheme() {
      const next = this.theme === 'glass' ? 'default' : 'glass';
      this.$emit('change-theme', next);
    }
  }
};
</script>

<style>
.ft-toolbar {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ft-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.ft-btn:hover {
  color: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.ft-btn-active {
  color: #3b82f6;
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.dark .ft-btn {
  background: rgba(30, 41, 59, 0.9);
  border-color: #374151;
  color: #9ca3af;
}

.dark .ft-btn:hover {
  color: #60a5fa;
  border-color: #60a5fa;
  box-shadow: 0 4px 16px rgba(96, 165, 250, 0.15);
}

.dark .ft-btn-active {
  color: #60a5fa;
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

[data-theme="glass"] .ft-btn {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  color: #6b7280;
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

[data-theme="glass"] .ft-btn:hover {
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.12);
}

[data-theme="glass"] .ft-btn-active {
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
}

[data-theme="glass"].dark .ft-btn {
  background: rgba(15, 23, 42, 0.45);
  border-color: rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

[data-theme="glass"].dark .ft-btn:hover {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.1);
}

[data-theme="glass"].dark .ft-btn-active {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(96, 165, 250, 0.08);
}
</style>
