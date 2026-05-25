<template>
  <a :href="item.url" target="_blank" 
     class="card-container flex flex-col bg-white dark:bg-gray-700 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border-2 border-transparent relative overflow-hidden">
    
    <div class="flex items-center p-3 sm:items-start sm:p-4">
      <img :src="item.icon" alt="icon" class="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 sm:mt-0.5 flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <h3 class="text-sm sm:text-base font-bold truncate">{{ item.name }}</h3>
        <p 
          class="desc-text text-xs text-gray-600 dark:text-gray-400"
          :title="item.description"
        >
          {{ item.description }}
        </p>
      </div>
    </div>
    
    <div v-if="previewState !== 'error'" v-show="showPreview" ref="previewArea" class="preview-area relative w-full flex-1 min-h-0 hidden sm:block overflow-hidden">
      <img
        v-if="previewSrc"
        :src="previewSrc"
        alt="preview"
        class="preview-image"
        @load="onPreviewLoad"
        @error="onPreviewError"
      />
      <div v-if="previewState === 'loading'" class="preview-overlay absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-600">
        <i class="fas fa-spinner fa-spin text-gray-400 dark:text-gray-500 text-2xl"></i>
      </div>
    </div>
    
    <div class="card-actions absolute top-1 right-1 flex items-center gap-1 z-10">
      <button 
        @click.prevent.stop="handleEdit"
        class="action-btn cursor-pointer text-gray-400 opacity-0 hover:opacity-100 hover:text-blue-500 transition-all duration-300"
        style="font-size: 14px; padding: 2px;"
      >
        <i class="fas fa-pen"></i>
      </button>
      <button 
        @click.prevent.stop="handleDelete"
        class="action-btn cursor-pointer text-gray-400 opacity-0 hover:opacity-100 hover:text-red-500 transition-all duration-300"
        style="font-size: 14px; padding: 2px;"
      >
        <i class="fas fa-trash-alt"></i>
      </button>
      <button 
        @click.prevent.stop="toggleFavorite" 
        class="action-btn cursor-pointer transition-all duration-300"
        :class="{
          'text-yellow-500 opacity-50': isFavorite,
          'text-gray-400 opacity-0 hover:opacity-100': !isFavorite
        }"
        style="font-size: 16px; padding: 2px;"
      >
        <i class="fas fa-star"></i>
      </button>
    </div>
  </a>
</template>

<style scoped>
.desc-text {
  display: none;
  overflow: hidden;
  line-height: 1.4;
  word-break: break-all;
}

@media (min-width: 640px) {
  .desc-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}

.card-container:hover {
  animation: borderPulse 2s infinite;
}

@keyframes borderPulse {
  0% { border-color: rgba(216, 180, 254, 0.5); }
  50% { border-color: rgba(184, 61, 143, 0.8); }
  100% { border-color: rgba(216, 180, 254, 0.5); }
}

:global(.dark) .card-container:hover {
  animation: borderPulseDark 2s infinite;
}

@keyframes borderPulseDark {
  0% { border-color: rgba(147, 51, 234, 0.5); }
  50% { border-color: rgba(168, 85, 247, 0.8); }
  100% { border-color: rgba(147, 51, 234, 0.5); }
}

.action-btn {
  cursor: pointer;
  background: none;
  border: none;
  z-index: 10;
  position: relative;
}

.card-container:hover .card-actions .action-btn:not(.text-yellow-500) {
  opacity: 1 !important;
}

.preview-area {
  background: inherit;
}

.preview-image {
  width: 100%;
  height: 100%;
  margin-left: 15%;
  margin-top: 1%;
  transform: rotate(-3deg);
  transform-origin: top right;
  object-fit: cover;
  border: 1px solid #dadada;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:global(.dark) .preview-image {
  border-color: #555;
}

.preview-overlay {
  z-index: 5;
}
</style>

<script>
import { getPreviewUrl, isPreviewCached, markPreviewCached } from '../utils/previewCache';

let globalLoadQueue = [];
let isProcessingQueue = false;

function processQueue() {
  if (isProcessingQueue || globalLoadQueue.length === 0) return;
  isProcessingQueue = true;
  const item = globalLoadQueue.shift();
  item.callback();
  setTimeout(() => {
    isProcessingQueue = false;
    processQueue();
  }, 800);
}

function enqueueLoad(callback) {
  globalLoadQueue.push({ callback });
  processQueue();
}

export default {
  emits: ['favorite-changed', 'edit', 'delete'],
  props: ['item', 'showPreview'],
  data() {
    return {
      favoriteItems: JSON.parse(localStorage.getItem('favoriteItems')) || [],
      previewState: 'idle',
      previewSrc: null,
      observer: null
    };
  },
  computed: {
    isFavorite() {
      return this.favoriteItems.includes(this.item.id);
    }
  },
  mounted() {
    if (this.showPreview) {
      this.setupLazyLoad();
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  watch: {
    showPreview(val) {
      if (val) {
        this.$nextTick(() => {
          this.setupLazyLoad();
        });
      } else {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
        this.previewState = 'idle';
        this.previewSrc = null;
      }
    }
  },
  methods: {
    setupLazyLoad() {
      const previewArea = this.$refs.previewArea;
      if (!previewArea) return;
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.observer.disconnect();
            if (isPreviewCached(this.item.url)) {
              this.previewSrc = getPreviewUrl(this.item.url);
              this.previewState = 'loading';
            } else {
              enqueueLoad(() => {
                this.previewSrc = getPreviewUrl(this.item.url);
                this.previewState = 'loading';
              });
            }
          }
        });
      }, {
        rootMargin: '200px'
      });
      
      this.observer.observe(previewArea);
    },
    onPreviewLoad() {
      this.previewState = 'loaded';
      markPreviewCached(this.item.url);
    },
    onPreviewError() {
      this.previewState = 'error';
      this.previewSrc = null;
    },
    toggleFavorite() {
      let favorites = JSON.parse(localStorage.getItem('favoriteItems')) || [];
      const itemId = this.item.id;
      
      if (favorites.includes(itemId)) {
        favorites = favorites.filter(id => id !== itemId);
      } else {
        favorites.push(itemId);
      }
      
      localStorage.setItem('favoriteItems', JSON.stringify(favorites));
      this.favoriteItems = favorites;
      
      this.$emit('favorite-changed');
    },
    handleEdit() {
      this.$emit('edit', this.item);
    },
    handleDelete() {
      this.$emit('delete', this.item);
    }
  }
};
</script>
