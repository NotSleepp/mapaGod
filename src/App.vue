<template>
  <div class="gis-container">
    <!-- Header -->
    <header v-if="false" class="gis-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1>GIS</h1>
            <p>Sistema Avanzado de Información Geográfica</p>
          </div>
        </div>
        
        <div class="header-actions">
          <button class="btn-icon" @click="showHelp = !showHelp" title="Ayuda">
            <HelpCircle :size="20" />
          </button>
          <button class="btn-icon" @click="toggleFullscreen" title="Pantalla completa">
            <Maximize2 :size="20" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="gis-main">
      <!-- Sidebar Toggle Button -->
      <button v-if="false" class="sidebar-toggle-external" @click="sidebarCollapsed = !sidebarCollapsed" :class="{ collapsed: sidebarCollapsed }">
        <ChevronLeft v-if="!sidebarCollapsed" :size="20" />
        <ChevronRight v-else :size="20" />
      </button>

      <!-- Sidebar -->
      <aside v-if="false" class="gis-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div v-if="!sidebarCollapsed" class="sidebar-content">
          <!-- Search -->
          <div class="search-section">
            <div class="search-input-wrapper">
              <Search :size="18" class="search-icon" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar dirección, lugar..." 
                class="search-input"
                @keyup.enter="performSearch"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
                <X :size="16" />
              </button>
            </div>
            
            <!-- Search Results -->
            <transition name="slide-fade">
              <div v-if="searchResults.length > 0" class="search-results">
                <div 
                  v-for="result in searchResults" 
                  :key="result.id"
                  class="search-result-item"
                  @click="selectSearchResult(result)"
                >
                  <div class="result-icon">
                    <MapPin :size="16" />
                  </div>
                  <div class="result-info">
                    <div class="result-name">{{ result.name }}</div>
                    <div class="result-address">{{ result.address }}</div>
                  </div>
                  <ChevronRight :size="16" class="result-arrow" />
                </div>
              </div>
            </transition>
          </div>

          <!-- Tabs -->
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" :size="18" />
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Layers Tab -->
            <transition name="fade" mode="out-in">
              <div v-if="activeTab === 'layers'" key="layers" class="layers-panel">
                <h3 class="panel-title">
                  <Layers :size="20" />
                  <span>Capas de Información</span>
                </h3>
                
                <div class="layer-group">
                  <div class="layer-group-header">
                    <div class="header-icon">
                      <Map :size="16" />
                    </div>
                    <span>Estilos de Mapa</span>
                  </div>
                  <div class="layer-items">
                    <div 
                      v-for="layer in baseLayers" 
                      :key="layer.id"
                      class="layer-item"
                      :class="{ active: activeBaseLayer === layer.id }"
                    >
                      <label class="layer-label">
                        <input 
                          type="radio" 
                          :value="layer.id"
                          v-model="activeBaseLayer"
                          @change="changeBaseLayer(layer.id)"
                        />
                        <span class="layer-name">{{ layer.name }}</span>
                      </label>
                      <div class="layer-preview" :style="{ background: layer.preview }"></div>
                    </div>
                  </div>
                </div>

                <div class="layer-group">
                  <div class="layer-group-header">
                    <div class="header-icon">
                      <Layers :size="16" />
                    </div>
                    <span>Capas Importadas</span>
                  </div>
                  <div class="layer-items">
                    <div 
                      v-for="layer in importedLayers" 
                      :key="layer.id"
                      class="layer-item"
                      :class="{ active: layer.visible }"
                    >
                      <label class="layer-label">
                        <input 
                          type="checkbox" 
                          v-model="layer.visible"
                          @change="toggleImportedLayer(layer.id)"
                        />
                        <span class="layer-name">{{ layer.name }}</span>
                      </label>
                      <button 
                        class="layer-delete-btn"
                        @click="deleteImportedLayer(layer.id)"
                        title="Eliminar"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>
                    <div v-if="importedLayers.length === 0" class="empty-hint">
                      No hay capas importadas
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tools Tab -->
              <div v-else-if="activeTab === 'tools'" key="tools" class="tools-panel">
                <h3 class="panel-title">
                  <Ruler :size="20" />
                  <span>Herramientas</span>
                </h3>
                
                <div class="tool-group">
                  <h4 class="tool-group-title">Importar/Exportar</h4>
                  
                  <button class="tool-btn" @click="triggerFileImport">
                    <div class="tool-icon">
                      <Upload :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Importar Archivo</div>
                      <div class="tool-desc">GeoJSON, KML, GPX</div>
                    </div>
                  </button>
                  <input 
                    ref="fileInput" 
                    type="file" 
                    accept=".geojson,.json,.kml,.gpx" 
                    @change="handleFileImport"
                    style="display: none"
                  />
                  
                  <button 
                    class="tool-btn"
                    @click="exportData"
                    :disabled="drawnFeatures.length === 0 && importedLayers.length === 0"
                  >
                    <div class="tool-icon">
                      <Download :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Exportar GeoJSON</div>
                      <div class="tool-desc">Guardar datos del mapa</div>
                    </div>
                  </button>
                </div>

                <div class="tool-group">
                  <h4 class="tool-group-title">Medición</h4>
                  <button 
                    class="tool-btn"
                    :class="{ active: activeTool === 'measure-distance' }"
                    @click="activateTool('measure-distance')"
                  >
                    <div class="tool-icon">
                      <Ruler :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Medir Distancia</div>
                      <div class="tool-desc">Calcular distancia entre puntos</div>
                    </div>
                  </button>
                  
                  <button 
                    class="tool-btn"
                    :class="{ active: activeTool === 'measure-area' }"
                    @click="activateTool('measure-area')"
                  >
                    <div class="tool-icon">
                      <Square :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Medir Área</div>
                      <div class="tool-desc">Calcular área de polígono</div>
                    </div>
                  </button>
                </div>

                <div class="tool-group">
                  <h4 class="tool-group-title">Dibujo</h4>
                  <button 
                    class="tool-btn"
                    :class="{ active: activeTool === 'draw-point' }"
                    @click="activateTool('draw-point')"
                  >
                    <div class="tool-icon">
                      <MapPin :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Punto</div>
                      <div class="tool-desc">Agregar marcador</div>
                    </div>
                  </button>
                  
                  <button 
                    class="tool-btn"
                    :class="{ active: activeTool === 'draw-line' }"
                    @click="activateTool('draw-line')"
                  >
                    <div class="tool-icon">
                      <Minus :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Línea</div>
                      <div class="tool-desc">Dibujar línea o ruta</div>
                    </div>
                  </button>
                  
                  <button 
                    class="tool-btn"
                    :class="{ active: activeTool === 'draw-polygon' }"
                    @click="activateTool('draw-polygon')"
                  >
                    <div class="tool-icon">
                      <Pentagon :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Polígono</div>
                      <div class="tool-desc">Dibujar área</div>
                    </div>
                  </button>
                  
                  <button 
                    class="tool-btn"
                    :class="{ active: activeTool === 'draw-circle' }"
                    @click="activateTool('draw-circle')"
                  >
                    <div class="tool-icon">
                      <Circle :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Círculo</div>
                      <div class="tool-desc">Dibujar círculo</div>
                    </div>
                  </button>

                  <button 
                    class="tool-btn danger"
                    @click="clearAllDrawings"
                    :disabled="drawnFeatures.length === 0"
                  >
                    <div class="tool-icon">
                      <Trash2 :size="18" />
                    </div>
                    <div class="tool-content">
                      <div class="tool-name">Limpiar Dibujos</div>
                      <div class="tool-desc">Eliminar todos los dibujos</div>
                    </div>
                  </button>
                </div>

                <div v-if="measurements.length > 0" class="measurements-list">
                  <h4 class="tool-group-title">Mediciones Recientes</h4>
                  <div 
                    v-for="(measurement, index) in measurements" 
                    :key="index"
                    class="measurement-item"
                  >
                    <div class="measurement-info">
                      <span class="measurement-type">{{ measurement.type }}</span>
                      <span class="measurement-value">{{ measurement.value }}</span>
                    </div>
                    <button class="measurement-delete" @click="deleteMeasurement(index)">
                      <X :size="14" />
                    </button>
                  </div>
                  <button class="clear-measurements-btn" @click="clearMeasurements">
                    Limpiar todas
                  </button>
                </div>

                <div v-if="drawnFeatures.length > 0" class="features-list">
                  <h4 class="tool-group-title">Elementos Dibujados ({{ drawnFeatures.length }})</h4>
                  <div 
                    v-for="(feature, index) in drawnFeatures" 
                    :key="feature.id"
                    class="feature-item"
                  >
                    <div class="feature-info">
                      <span class="feature-type">{{ getFeatureTypeName(feature.geometry.type) }}</span>
                      <span class="feature-id">#{{ index + 1 }}</span>
                    </div>
                    <button class="feature-delete" @click="deleteFeature(feature.id)">
                      <X :size="14" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Legend Tab -->
              <div v-else-if="activeTab === 'legend'" key="legend" class="legend-panel">
                <h3 class="panel-title">
                  <Map :size="20" />
                  <span>Leyenda</span>
                </h3>
                
                <div class="legend-group">
                  <h4 class="legend-title">Elementos Dibujados</h4>
                  <div class="legend-items">
                    <div class="legend-item">
                      <div class="legend-color" style="background: #3b82f6;"></div>
                      <span class="legend-label">Puntos</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background: #8b5cf6;"></div>
                      <span class="legend-label">Líneas</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background: #ec4899;"></div>
                      <span class="legend-label">Polígonos</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background: #f59e0b;"></div>
                      <span class="legend-label">Círculos</span>
                    </div>
                  </div>
                </div>

                <div class="legend-group">
                  <h4 class="legend-title">Mediciones</h4>
                  <div class="legend-items">
                    <div class="legend-item">
                      <div class="legend-color" style="background: #10b981;"></div>
                      <span class="legend-label">Distancia</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color" style="background: #06b6d4;"></div>
                      <span class="legend-label">Área</span>
                    </div>
                  </div>
                </div>

                <div v-if="importedLayers.filter(l => l.visible).length > 0" class="legend-group">
                  <h4 class="legend-title">Capas Importadas</h4>
                  <div class="legend-items">
                    <div v-for="layer in importedLayers.filter(l => l.visible)" :key="layer.id" class="legend-item">
                      <div class="legend-color" :style="{ background: layer.color }"></div>
                      <span class="legend-label">{{ layer.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info Tab -->
              <div v-else-if="activeTab === 'info'" key="info" class="info-panel">
                <h3 class="panel-title">
                  <Info :size="20" />
                  <span>Información</span>
                </h3>
                
                <div v-if="selectedFeature" class="feature-info">
                  <div class="feature-header">
                    <Activity :size="20" />
                    <span>{{ selectedFeature.name }}</span>
                  </div>
                  
                  <div class="feature-properties">
                    <div v-for="(value, key) in selectedFeature.properties" :key="key" class="property-row">
                      <span class="property-key">{{ key }}</span>
                      <span class="property-value">{{ value }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-state">
                  <Info :size="48" class="empty-icon" />
                  <p>Sin selección</p>
                  <span class="empty-hint">Haz clic en un elemento del mapa</span>
                </div>

                <div class="info-stats">
                  <h4 class="stats-title">Estadísticas del Mapa</h4>
                  <div class="stat-item">
                    <span class="stat-label">Elementos dibujados</span>
                    <span class="stat-value">{{ drawnFeatures.length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Capas importadas</span>
                    <span class="stat-value">{{ importedLayers.length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Mediciones</span>
                    <span class="stat-value">{{ measurements.length }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </aside>

      <!-- Map Container -->
      <div class="map-wrapper">
        <div ref="mapContainer" class="map-container"></div>

        <div class="floating-search">
           <div class="floating-search-row">
             <div class="search-input-wrapper">
               <Search :size="18" class="search-icon" />
               <input 
                 v-model="searchQuery" 
                 type="text" 
                 placeholder="Buscar dirección, lugar..." 
                 class="search-input"
                 @keyup.enter="performSearch"
               />
               <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
                 <X :size="16" />
               </button>
             </div>
             <div class="filter-chips">
               <button class="style-chip" :class="{ active: filterCalles }" @click="filterCalles = !filterCalles">Calles</button>
               <button class="style-chip" :class="{ active: filterManzanas }" @click="filterManzanas = !filterManzanas">Manzanas</button>
               <button class="style-chip" :class="{ active: filterParcelas }" @click="filterParcelas = !filterParcelas">Parcelas</button>
             </div>
           </div>
           <transition name="slide-fade">
             <div v-if="searchResults.length > 0" class="search-results floating-results">
               <div 
                 v-for="result in searchResults" 
                 :key="result.id"
                 class="search-result-item"
                 @click="selectSearchResult(result)"
               >
                 <div class="result-icon">
                   <MapPin :size="16" />
                 </div>
                 <div class="result-info">
                   <div class="result-name">{{ result.name }}</div>
                   <div class="result-address">{{ result.address }}</div>
                 </div>
                 <ChevronRight :size="16" class="result-arrow" />
               </div>
             </div>
           </transition>
         </div>

        <!-- Active Tool Indicator -->
        <transition name="fade">
          <div v-if="activeTool" class="active-tool-indicator">
            <div class="tool-indicator-content">
              <component :is="getToolIcon(activeTool)" :size="20" />
              <span>{{ getToolName(activeTool) }}</span>
              <button @click="deactivateTool" class="tool-cancel">
                <X :size="16" />
              </button>
            </div>
            <div class="tool-hint">{{ getToolHint(activeTool) }}</div>
          </div>
        </transition>

        <!-- Map Controls -->
        <div class="map-controls">
          <div class="control-group">
            <button class="control-btn" @click="zoomIn" title="Acercar">
              <Plus :size="20" />
            </button>
            <button class="control-btn" @click="zoomOut" title="Alejar">
              <Minus :size="20" />
            </button>
            <button class="control-btn" @click="resetView" title="Vista inicial">
              <Home :size="20" />
            </button>
            <button class="control-btn" @click="locateUser" title="Mi ubicación">
              <Navigation :size="20" />
            </button>
            <button class="control-btn" @click="toggleFullscreen" title="Pantalla completa">
              <Maximize2 :size="20" />
            </button>
          </div>

          <div class="control-group">
            <button 
              class="control-btn"
              :class="{ active: show3D }"
              @click="toggle3D"
              title="Vista 3D"
            >
              <Box :size="20" />
            </button>
            <button 
              class="control-btn"
              :class="{ active: showTerrain }"
              @click="toggleTerrain"
              title="Terreno 3D"
            >
              <Mountain :size="20" />
            </button>
            <button class="control-btn" @click="printMap" title="Imprimir">
              <Printer :size="20" />
            </button>
            <button class="control-btn" @click="shareMap" title="Compartir">
              <Share2 :size="20" />
            </button>
          </div>

          <div class="style-selector" @mouseenter="openStyleOptions" @mouseleave="closeStyleOptions">
            <button class="control-btn" title="Estilo de mapa" @mouseenter="openStyleOptions">
              <Layers :size="20" />
            </button>
            <div class="style-options" :class="{ open: styleOptionsOpen }" @mouseenter="openStyleOptions" @mouseleave="closeStyleOptions">
              <button 
                v-for="layer in baseLayers" 
                :key="layer.id" 
                class="style-chip" 
                :class="{ active: activeBaseLayer === layer.id }" 
                @click="changeBaseLayer(layer.id)"
              >
                {{ layer.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Coordinates Display -->
        <div class="coordinates-display">
          <div class="coord-item">
            <span class="coord-label">Lat</span>
            <span class="coord-value">{{ currentCoords.lat }}</span>
          </div>
          <div class="coord-separator"></div>
          <div class="coord-item">
            <span class="coord-label">Lng</span>
            <span class="coord-value">{{ currentCoords.lng }}</span>
          </div>
          <div class="coord-separator"></div>
          <div class="coord-item">
            <span class="coord-label">Zoom</span>
            <span class="coord-value">{{ currentZoom }}</span>
          </div>
        </div>

        <!-- Scale Control -->
        <div class="scale-control">
          <div class="scale-line" :style="{ width: scaleWidth + 'px' }"></div>
          <div class="scale-text">{{ scaleText }}</div>
        </div>

        <!-- Loading Indicator -->
        <transition name="fade">
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>Cargando mapa...</p>
          </div>
        </transition>

        <!-- Notification Toast -->
        <transition name="slide-up">
          <div v-if="notification" class="notification-toast" :class="notification.type">
            <component :is="notification.icon" :size="20" />
            <span>{{ notification.message }}</span>
          </div>
        </transition>
      </div>
    </div>

    <!-- Help Modal -->
    <transition name="modal">
      <div v-if="showHelp" class="modal-overlay" @click="showHelp = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Ayuda - Sistema GIS Pro</h2>
            <button class="modal-close" @click="showHelp = false">
              <X :size="24" />
            </button>
          </div>
          <div class="modal-body">
            <div class="help-section">
              <h3>Navegación</h3>
              <ul>
                <li>Arrastra el mapa para moverte</li>
                <li>Usa la rueda del mouse para hacer zoom</li>
                <li>Mantén Ctrl y arrastra para rotar el mapa</li>
                <li>Mantén Shift y arrastra para inclinar (vista 3D)</li>
              </ul>
            </div>
            <div class="help-section">
              <h3>Herramientas de Dibujo</h3>
              <ul>
                <li><strong>Punto:</strong> Haz clic en el mapa para agregar un marcador</li>
                <li><strong>Línea:</strong> Haz clic para agregar puntos, doble clic para finalizar</li>
                <li><strong>Polígono:</strong> Haz clic para agregar vértices, doble clic para cerrar</li>
                <li><strong>Círculo:</strong> Haz clic en el centro y arrastra para definir el radio</li>
              </ul>
            </div>
            <div class="help-section">
              <h3>Medición</h3>
              <ul>
                <li><strong>Distancia:</strong> Haz clic en puntos para medir la distancia total</li>
                <li><strong>Área:</strong> Dibuja un polígono para calcular su área</li>
              </ul>
            </div>
            <div class="help-section">
              <h3>Importar/Exportar</h3>
              <ul>
                <li>Importa archivos GeoJSON, KML o GPX con tus datos</li>
                <li>Exporta todos tus dibujos y capas como GeoJSON</li>
                <li>Los archivos importados aparecen como capas que puedes activar/desactivar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { 
  Search, X, MapPin, Layers, Map, Info, HelpCircle, Maximize2,
  ChevronLeft, ChevronRight, Ruler, Square, Minus, Pentagon,
  Circle, Activity, Plus, Home, Navigation, Box, Printer, Share2,
  Upload, Download, Trash2, Mountain, CheckCircle, AlertCircle
} from 'lucide-vue-next'

// State
const mapContainer = ref(null)
const map = ref(null)
const sidebarCollapsed = ref(false)
const activeTab = ref('tools')
const searchQuery = ref('')
const searchResults = ref([])
const activeTool = ref(null)
const measurements = ref([])
const drawnFeatures = ref([])
const selectedFeature = ref(null)
const showHelp = ref(false)
const isLoading = ref(true)
const show3D = ref(true)
const showTerrain = ref(false)
const currentCoords = ref({ lat: '-36.5806', lng: '-56.6917' })
const currentZoom = ref(13)
const scaleWidth = ref(100)
const scaleText = ref('1 km')
// <CHANGE> Cambiar capa base inicial a OpenStreetMap
const activeBaseLayer = ref('osm')
const fileInput = ref(null)
const importedLayers = ref([])
const notification = ref(null)
const filterCalles = ref(true)
const filterManzanas = ref(true)
const filterParcelas = ref(false)

const styleOptionsOpen = ref(false)
let styleOptionsCloseTimer = null
const openStyleOptions = () => {
  if (styleOptionsCloseTimer) { clearTimeout(styleOptionsCloseTimer) }
  styleOptionsOpen.value = true
}
const closeStyleOptions = () => {
  if (styleOptionsCloseTimer) { clearTimeout(styleOptionsCloseTimer) }
  styleOptionsCloseTimer = setTimeout(() => { styleOptionsOpen.value = false }, 200)
}

 // Persistencia de selección en localStorage
 watch(activeBaseLayer, (val) => {
   try { localStorage.setItem('activeBaseLayer', val) } catch {}
 })
 watch([filterCalles, filterManzanas, filterParcelas], ([c, m, p]) => {
   try { localStorage.setItem('filters', JSON.stringify({ c, m, p })) } catch {}
 })

// Drawing state
let drawingPoints = []
let drawingLine = null
let drawingPolygon = null
let measurementMarkers = []
let currentMeasurementLine = null

// Tabs configuration
const tabs = [
  { id: 'layers', label: 'Capas', icon: Layers },
  { id: 'tools', label: 'Herramientas', icon: Ruler },
  { id: 'legend', label: 'Leyenda', icon: Map },
  { id: 'info', label: 'Info', icon: Info }
]

// Base layers with actual working styles
const baseLayers = [
  { 
    id: 'streets', 
    name: 'Calles', 
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    preview: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
  },
  { 
    id: 'satellite', 
    name: 'Satélite', 
    url: 'satellite',
    preview: 'linear-gradient(135deg, #1a5f3f 0%, #0d3a24 100%)'
  },
  { 
    id: 'dark', 
    name: 'Oscuro', 
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    preview: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  },
  { 
    id: 'terrain', 
    name: 'Terreno', 
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    preview: 'linear-gradient(135deg, #d4e5d4 0%, #a8c5a8 100%)'
  },
  { 
    id: 'osm', 
    name: 'OpenStreetMap', 
    url: 'osm',
    preview: 'linear-gradient(135deg, #f2efe9 0%, #c8c4b7 100%)'
  }
]

// Límites de zoom por tema (a 10/17/2025)
const BASE_LAYER_ZOOM_LIMITS = {
  streets: { min: 0, max: 20 },
  dark: { min: 0, max: 20 },
  terrain: { min: 0, max: 20 },
  osm: { min: 0, max: 18 },
  satellite: { min: 0, max: 16 }
}

// Methods
const showNotification = (message, type = 'success') => {
  notification.value = {
    message,
    type,
    icon: type === 'success' ? CheckCircle : AlertCircle
  }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=5`
    )
    const data = await response.json()
    
    searchResults.value = data.map((item, index) => ({
      id: index,
      name: item.display_name.split(',')[0],
      address: item.display_name,
      coords: [parseFloat(item.lon), parseFloat(item.lat)]
    }))
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const selectSearchResult = (result) => {
  if (map.value) {
    map.value.flyTo({
      center: result.coords,
      zoom: 15,
      duration: 1500
    })
    
    new maplibregl.Marker({ color: '#ef4444' })
      .setLngLat(result.coords)
      .setPopup(
        new maplibregl.Popup({ offset: 25 })
          .setHTML(`<div style="padding: 8px; color: #000;"><strong>${result.name}</strong><br/><small>${result.address}</small></div>`)
      )
      .addTo(map.value)
  }
  searchResults.value = []
}

const changeBaseLayer = (layerId) => {
  const layer = baseLayers.find(l => l.id === layerId)
  if (!layer || !map.value) return
  
  activeBaseLayer.value = layerId
  isLoading.value = true
  
  if (layerId === 'osm') {
    map.value.setStyle({
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
          maxzoom: 19
        }
      },
      layers: [{
        id: 'osm',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }]
    })
  } else if (layerId === 'satellite') {
    map.value.setStyle({
      version: 8,
      sources: {
        'satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
          maxzoom: 19
        }
      },
      layers: [{
        id: 'satellite',
        type: 'raster',
        source: 'satellite',
        minzoom: 0,
        maxzoom: 19
      }]
    })
  } else {
    map.value.setStyle(layer.url)
  }
  
  map.value.once('styledata', () => {
    const limits = BASE_LAYER_ZOOM_LIMITS[layerId] || { min: 0, max: 20 }
    map.value.setMinZoom(limits.min)
    map.value.setMaxZoom(limits.max)
    isLoading.value = false
    reloadAllLayers()
    showNotification(`Estilo cambiado a ${layer.name}`)
  })
}

const reloadAllLayers = () => {
  // Reload drawn features
  if (map.value.getSource('drawn-features')) {
    map.value.getSource('drawn-features').setData({
      type: 'FeatureCollection',
      features: drawnFeatures.value
    })
  } else {
    addDrawnFeaturesSource()
  }
  
  // Reload imported layers
  importedLayers.value.forEach(layer => {
    if (layer.visible) {
      addImportedLayerToMap(layer)
    }
  })
}

const addDrawnFeaturesSource = () => {
  if (!map.value.getSource('drawn-features')) {
    map.value.addSource('drawn-features', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: drawnFeatures.value
      }
    })
    
    // Add layers for different geometry types
    map.value.addLayer({
      id: 'drawn-polygons',
      type: 'fill',
      source: 'drawn-features',
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'fill-color': '#ec4899',
        'fill-opacity': 0.3
      }
    })
    
    map.value.addLayer({
      id: 'drawn-polygons-outline',
      type: 'line',
      source: 'drawn-features',
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'line-color': '#ec4899',
        'line-width': 2
      }
    })
    
    map.value.addLayer({
      id: 'drawn-lines',
      type: 'line',
      source: 'drawn-features',
      filter: ['==', '$type', 'LineString'],
      paint: {
        'line-color': '#8b5cf6',
        'line-width': 3
      }
    })
    
    map.value.addLayer({
      id: 'drawn-points',
      type: 'circle',
      source: 'drawn-features',
      filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': 8,
        'circle-color': '#3b82f6',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    })
  }
}

const toggleImportedLayer = (layerId) => {
  const layer = importedLayers.value.find(l => l.id === layerId)
  if (!layer) return
  
  if (layer.visible) {
    addImportedLayerToMap(layer)
  } else {
    removeImportedLayerFromMap(layer)
  }
}

const addImportedLayerToMap = (layer) => {
  if (!map.value) return
  
  const sourceId = `imported-${layer.id}`
  const layerId = `imported-layer-${layer.id}`
  
  if (!map.value.getSource(sourceId)) {
    map.value.addSource(sourceId, {
      type: 'geojson',
      data: layer.data
    })
    
    // Determine layer type based on geometry
    const firstFeature = layer.data.features[0]
    if (firstFeature) {
      const geomType = firstFeature.geometry.type
      
      if (geomType === 'Point' || geomType === 'MultiPoint') {
        map.value.addLayer({
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 6,
            'circle-color': layer.color,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        })
      } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
        map.value.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': layer.color,
            'line-width': 3
          }
        })
      } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        map.value.addLayer({
          id: `${layerId}-fill`,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': layer.color,
            'fill-opacity': 0.3
          }
        })
        map.value.addLayer({
          id: `${layerId}-outline`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': layer.color,
            'line-width': 2
          }
        })
      }
    }
  }
}

const removeImportedLayerFromMap = (layer) => {
  if (!map.value) return
  
  const layerId = `imported-layer-${layer.id}`
  
  if (map.value.getLayer(layerId)) {
    map.value.removeLayer(layerId)
  }
  if (map.value.getLayer(`${layerId}-fill`)) {
    map.value.removeLayer(`${layerId}-fill`)
  }
  if (map.value.getLayer(`${layerId}-outline`)) {
    map.value.removeLayer(`${layerId}-outline`)
  }
}

const deleteImportedLayer = (layerId) => {
  const layer = importedLayers.value.find(l => l.id === layerId)
  if (layer) {
    removeImportedLayerFromMap(layer)
    const sourceId = `imported-${layer.id}`
    if (map.value.getSource(sourceId)) {
      map.value.removeSource(sourceId)
    }
  }
  importedLayers.value = importedLayers.value.filter(l => l.id !== layerId)
  showNotification('Capa eliminada')
}

const activateTool = (tool) => {
  if (activeTool.value === tool) {
    deactivateTool()
    return
  }
  
  deactivateTool()
  activeTool.value = tool
  map.value.getCanvas().style.cursor = 'crosshair'
  
  if (tool === 'measure-distance' || tool === 'measure-area') {
    drawingPoints = []
    measurementMarkers = []
  }
}

const deactivateTool = () => {
  activeTool.value = null
  map.value.getCanvas().style.cursor = ''
  cleanupDrawing()
}

const cleanupDrawing = () => {
  drawingPoints = []
  
  if (drawingLine) {
    drawingLine.remove()
    drawingLine = null
  }
  
  if (drawingPolygon) {
    drawingPolygon.remove()
    drawingPolygon = null
  }
  
  if (currentMeasurementLine && map.value.getSource('measurement-line')) {
    map.value.getSource('measurement-line').setData({
      type: 'FeatureCollection',
      features: []
    })
  }
  
  measurementMarkers.forEach(marker => marker.remove())
  measurementMarkers = []
}

const handleMapClick = (e) => {
  if (!activeTool.value) return
  
  const coords = [e.lngLat.lng, e.lngLat.lat]
  
  switch (activeTool.value) {
    case 'draw-point':
      addPoint(coords)
      deactivateTool()
      break
    case 'draw-line':
      addLinePoint(coords)
      break
    case 'draw-polygon':
      addPolygonPoint(coords)
      break
    case 'measure-distance':
      addMeasurementPoint(coords, 'distance')
      break
    case 'measure-area':
      addMeasurementPoint(coords, 'area')
      break
  }
}

const handleMapDblClick = (e) => {
  if (!activeTool.value) return
  
  e.preventDefault()
  
  if (activeTool.value === 'draw-line') {
    finishLine()
  } else if (activeTool.value === 'draw-polygon') {
    finishPolygon()
  } else if (activeTool.value === 'measure-distance') {
    finishMeasurement('distance')
  } else if (activeTool.value === 'measure-area') {
    finishMeasurement('area')
  }
}

const addPoint = (coords) => {
  const feature = {
    id: `point-${Date.now()}`,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords
    },
    properties: {
      type: 'point',
      createdAt: new Date().toISOString()
    }
  }
  
  drawnFeatures.value.push(feature)
  updateDrawnFeatures()
  showNotification('Punto agregado')
}

const addLinePoint = (coords) => {
  drawingPoints.push(coords)
  
  if (drawingPoints.length === 1) {
    // First point
    const el = document.createElement('div')
    el.className = 'drawing-marker'
    el.style.width = '10px'
    el.style.height = '10px'
    el.style.borderRadius = '50%'
    el.style.background = '#8b5cf6'
    el.style.border = '2px solid white'
    
    new maplibregl.Marker({ element: el })
      .setLngLat(coords)
      .addTo(map.value)
  } else {
    // Update line
    if (!map.value.getSource('temp-line')) {
      map.value.addSource('temp-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: drawingPoints
          }
        }
      })
      
      map.value.addLayer({
        id: 'temp-line-layer',
        type: 'line',
        source: 'temp-line',
        paint: {
          'line-color': '#8b5cf6',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      })
    } else {
      map.value.getSource('temp-line').setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: drawingPoints
        }
      })
    }
  }
}

const finishLine = () => {
  if (drawingPoints.length < 2) {
    showNotification('Se necesitan al menos 2 puntos', 'error')
    return
  }
  
  const feature = {
    id: `line-${Date.now()}`,
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: drawingPoints
    },
    properties: {
      type: 'line',
      createdAt: new Date().toISOString()
    }
  }
  
  drawnFeatures.value.push(feature)
  updateDrawnFeatures()
  
  // Clean up temp line
  if (map.value.getLayer('temp-line-layer')) {
    map.value.removeLayer('temp-line-layer')
    map.value.removeSource('temp-line')
  }
  
  deactivateTool()
  showNotification('Línea completada')
}

const addPolygonPoint = (coords) => {
  drawingPoints.push(coords)
  
  if (drawingPoints.length >= 3) {
    const polygonCoords = [...drawingPoints, drawingPoints[0]]
    
    if (!map.value.getSource('temp-polygon')) {
      map.value.addSource('temp-polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [polygonCoords]
          }
        }
      })
      
      map.value.addLayer({
        id: 'temp-polygon-fill',
        type: 'fill',
        source: 'temp-polygon',
        paint: {
          'fill-color': '#ec4899',
          'fill-opacity': 0.3
        }
      })
      
      map.value.addLayer({
        id: 'temp-polygon-outline',
        type: 'line',
        source: 'temp-polygon',
        paint: {
          'line-color': '#ec4899',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      })
    } else {
      map.value.getSource('temp-polygon').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [polygonCoords]
        }
      })
    }
  }
}

const finishPolygon = () => {
  if (drawingPoints.length < 3) {
    showNotification('Se necesitan al menos 3 puntos', 'error')
    return
  }
  
  const feature = {
    id: `polygon-${Date.now()}`,
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[...drawingPoints, drawingPoints[0]]]
    },
    properties: {
      type: 'polygon',
      createdAt: new Date().toISOString()
    }
  }
  
  drawnFeatures.value.push(feature)
  updateDrawnFeatures()
  
  // Clean up temp polygon
  if (map.value.getLayer('temp-polygon-fill')) {
    map.value.removeLayer('temp-polygon-fill')
    map.value.removeLayer('temp-polygon-outline')
    map.value.removeSource('temp-polygon')
  }
  
  deactivateTool()
  showNotification('Polígono completado')
}

const addMeasurementPoint = (coords, type) => {
  drawingPoints.push(coords)
  
  const el = document.createElement('div')
  el.className = 'measurement-marker'
  el.style.width = '12px'
  el.style.height = '12px'
  el.style.borderRadius = '50%'
  el.style.background = type === 'distance' ? '#10b981' : '#06b6d4'
  el.style.border = '2px solid white'
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
  
  const marker = new maplibregl.Marker({ element: el })
    .setLngLat(coords)
    .addTo(map.value)
  
  measurementMarkers.push(marker)
  
  if (drawingPoints.length > 1) {
    if (!map.value.getSource('measurement-line')) {
      map.value.addSource('measurement-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: drawingPoints
          }
        }
      })
      
      map.value.addLayer({
        id: 'measurement-line-layer',
        type: 'line',
        source: 'measurement-line',
        paint: {
          'line-color': type === 'distance' ? '#10b981' : '#06b6d4',
          'line-width': 2,
          'line-dasharray': [4, 2]
        }
      })
    } else {
      map.value.getSource('measurement-line').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon', // Changed from LineString to Polygon for area measurement
          coordinates: [[...drawingPoints, drawingPoints[0]]]
        }
      })
    }
  }
}

const finishMeasurement = (type) => {
  if (type === 'distance' && drawingPoints.length < 2) {
    showNotification('Se necesitan al menos 2 puntos', 'error')
    return
  }
  
  if (type === 'area' && drawingPoints.length < 3) {
    showNotification('Se necesitan al menos 3 puntos', 'error')
    return
  }
  
  let value
  if (type === 'distance') {
    value = calculateDistance(drawingPoints)
  } else {
    value = calculateArea(drawingPoints)
  }
  
  measurements.value.push({
    type: type === 'distance' ? 'Distancia' : 'Área',
    value,
    timestamp: new Date().toISOString()
  })
  
  deactivateTool()
  showNotification(`${type === 'distance' ? 'Distancia' : 'Área'} medida: ${value}`)
}

const calculateDistance = (points) => {
  let total = 0
  for (let i = 0; i < points.length - 1; i++) {
    total += getDistanceBetweenPoints(points[i], points[i + 1])
  }
  
  if (total < 1000) {
    return `${total.toFixed(2)} m`
  } else {
    return `${(total / 1000).toFixed(2)} km`
  }
}

const calculateArea = (points) => {
  const polygon = [...points, points[0]]
  let area = 0
  
  for (let i = 0; i < polygon.length - 1; i++) {
    const p1 = polygon[i]
    const p2 = polygon[i + 1]
    area += (p2[0] - p1[0]) * (p2[1] + p1[1])
  }
  
  area = Math.abs(area / 2)
  
  // Convert to square meters (approximate)
  const areaInMeters = area * 111320 * 111320 * Math.cos(points[0][1] * Math.PI / 180)
  
  if (areaInMeters < 10000) {
    return `${areaInMeters.toFixed(2)} m²`
  } else if (areaInMeters < 1000000) {
    return `${(areaInMeters / 10000).toFixed(2)} ha`
  } else {
    return `${(areaInMeters / 1000000).toFixed(2)} km²`
  }
}

const getDistanceBetweenPoints = (p1, p2) => {
  const R = 6371000 // Earth radius in meters
  const lat1 = p1[1] * Math.PI / 180
  const lat2 = p2[1] * Math.PI / 180
  const deltaLat = (p2[1] - p1[1]) * Math.PI / 180
  const deltaLng = (p2[0] - p1[0]) * Math.PI / 180
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

const updateDrawnFeatures = () => {
  if (map.value.getSource('drawn-features')) {
    map.value.getSource('drawn-features').setData({
      type: 'FeatureCollection',
      features: drawnFeatures.value
    })
  }
}

const deleteFeature = (featureId) => {
  drawnFeatures.value = drawnFeatures.value.filter(f => f.id !== featureId)
  updateDrawnFeatures()
  showNotification('Elemento eliminado')
}

const clearAllDrawings = () => {
  if (confirm('¿Estás seguro de que quieres eliminar todos los dibujos?')) {
    drawnFeatures.value = []
    updateDrawnFeatures()
    showNotification('Todos los dibujos eliminados')
  }
}

const deleteMeasurement = (index) => {
  measurements.value.splice(index, 1)
}

const clearMeasurements = () => {
  measurements.value = []
  showNotification('Mediciones eliminadas')
}

const triggerFileImport = () => {
  fileInput.value.click()
}

const handleFileImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    let geojson
    
    if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
      geojson = JSON.parse(text)
    } else if (file.name.endsWith('.kml')) {
      geojson = await convertKMLToGeoJSON(text)
    } else if (file.name.endsWith('.gpx')) {
      geojson = await convertGPXToGeoJSON(text)
    } else {
      showNotification('Formato de archivo no soportado', 'error')
      return
    }
    
    // Ensure it's a FeatureCollection
    if (geojson.type !== 'FeatureCollection') {
      geojson = {
        type: 'FeatureCollection',
        features: [geojson]
      }
    }
    
    const layer = {
      id: `layer-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      data: geojson,
      visible: true,
      color: getRandomColor()
    }
    
    importedLayers.value.push(layer)
    addImportedLayerToMap(layer)
    
    // Fit map to imported data
    const bounds = new maplibregl.LngLatBounds()
    geojson.features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        bounds.extend(feature.geometry.coordinates)
      } else if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(coord => bounds.extend(coord))
      } else if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates[0].forEach(coord => bounds.extend(coord))
      }
    })
    
    map.value.fitBounds(bounds, { padding: 50 })
    showNotification(`Archivo "${file.name}" importado correctamente`)
    
  } catch (error) {
    console.error('Import error:', error)
    showNotification('Error al importar el archivo', 'error')
  }
  
  event.target.value = ''
}

const convertKMLToGeoJSON = async (kmlText) => {
  // Simple KML to GeoJSON converter (basic implementation)
  const parser = new DOMParser()
  const kml = parser.parseFromString(kmlText, 'text/xml')
  const features = []
  
  const placemarks = kml.getElementsByTagName('Placemark')
  for (let i = 0; i < placemarks.length; i++) {
    const placemark = placemarks[i]
    const name = placemark.getElementsByTagName('name')[0]?.textContent || `Feature ${i + 1}`
    
    const point = placemark.getElementsByTagName('Point')[0]
    const lineString = placemark.getElementsByTagName('LineString')[0]
    const polygon = placemark.getElementsByTagName('Polygon')[0]
    
    let geometry
    if (point) {
      const coords = point.getElementsByTagName('coordinates')[0].textContent.trim().split(',')
      geometry = {
        type: 'Point',
        coordinates: [parseFloat(coords[0]), parseFloat(coords[1])]
      }
    } else if (lineString) {
      const coords = lineString.getElementsByTagName('coordinates')[0].textContent.trim()
        .split(/\s+/)
        .map(c => {
          const parts = c.split(',')
          return [parseFloat(parts[0]), parseFloat(parts[1])]
        })
      geometry = {
        type: 'LineString',
        coordinates: coords
      }
    } else if (polygon) {
      const coords = polygon.getElementsByTagName('coordinates')[0].textContent.trim()
        .split(/\s+/)
        .map(c => {
          const parts = c.split(',')
          return [parseFloat(parts[0]), parseFloat(parts[1])]
        })
      geometry = {
        type: 'Polygon',
        coordinates: [coords]
      }
    }
    
    if (geometry) {
      features.push({
        type: 'Feature',
        properties: { name },
        geometry
      })
    }
  }
  
  return {
    type: 'FeatureCollection',
    features
  }
}

const convertGPXToGeoJSON = async (gpxText) => {
  // Simple GPX to GeoJSON converter
  const parser = new DOMParser()
  const gpx = parser.parseFromString(gpxText, 'text/xml')
  const features = []
  
  // Waypoints
  const wpts = gpx.getElementsByTagName('wpt')
  for (let i = 0; i < wpts.length; i++) {
    const wpt = wpts[i]
    const name = wpt.getElementsByTagName('name')[0]?.textContent || `Waypoint ${i + 1}`
    features.push({
      type: 'Feature',
      properties: { name },
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(wpt.getAttribute('lon')),
          parseFloat(wpt.getAttribute('lat'))
        ]
      }
    })
  }
  
  // Tracks
  const trks = gpx.getElementsByTagName('trk')
  for (let i = 0; i < trks.length; i++) {
    const trk = trks[i]
    const name = trk.getElementsByTagName('name')[0]?.textContent || `Track ${i + 1}`
    const trkpts = trk.getElementsByTagName('trkpt')
    const coords = []
    
    for (let j = 0; j < trkpts.length; j++) {
      const pt = trkpts[j]
      coords.push([
        parseFloat(pt.getAttribute('lon')),
        parseFloat(pt.getAttribute('lat'))
      ])
    }
    
    if (coords.length > 0) {
      features.push({
        type: 'Feature',
        properties: { name },
        geometry: {
          type: 'LineString',
          coordinates: coords
        }
      })
    }
  }
  
  return {
    type: 'FeatureCollection',
    features
  }
}

const exportData = () => {
  const data = {
    type: 'FeatureCollection',
    features: [
      ...drawnFeatures.value,
      ...importedLayers.value.flatMap(layer => layer.data.features)
    ]
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gis-export-${Date.now()}.geojson`
  a.click()
  URL.revokeObjectURL(url)
  
  showNotification('Datos exportados correctamente')
}

const getRandomColor = () => {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444']
  return colors[Math.floor(Math.random() * colors.length)]
}

const getFeatureTypeName = (type) => {
  const names = {
    'Point': 'Punto',
    'LineString': 'Línea',
    'Polygon': 'Polígono'
  }
  return names[type] || type
}

const getToolIcon = (tool) => {
  const icons = {
    'draw-point': MapPin,
    'draw-line': Minus,
    'draw-polygon': Pentagon,
    'draw-circle': Circle,
    'measure-distance': Ruler,
    'measure-area': Square
  }
  return icons[tool] || Ruler
}

const getToolName = (tool) => {
  const names = {
    'draw-point': 'Dibujar Punto',
    'draw-line': 'Dibujar Línea',
    'draw-polygon': 'Dibujar Polígono',
    'draw-circle': 'Dibujar Círculo',
    'measure-distance': 'Medir Distancia',
    'measure-area': 'Medir Área'
  }
  return names[tool] || tool
}

const getToolHint = (tool) => {
  const hints = {
    'draw-point': 'Haz clic en el mapa para agregar un punto',
    'draw-line': 'Haz clic para agregar puntos, doble clic para finalizar',
    'draw-polygon': 'Haz clic para agregar vértices, doble clic para cerrar',
    'draw-circle': 'Haz clic en el centro y arrastra para definir el radio',
    'measure-distance': 'Haz clic en puntos para medir distancia, doble clic para finalizar',
    'measure-area': 'Haz clic para crear polígono, doble clic para calcular área'
  }
  return hints[tool] || ''
}

const zoomIn = () => {
  if (map.value) {
    map.value.zoomIn({ duration: 300 })
  }
}

const zoomOut = () => {
  if (map.value) {
    map.value.zoomOut({ duration: 300 })
  }
}

const resetView = () => {
  if (map.value) {
    map.value.flyTo({
      center: [-56.6917, -36.5806],
      zoom: 13,
      pitch: 60,
      bearing: -45,
      duration: 1500
    })
  }
}

const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.longitude, position.coords.latitude]
        if (map.value) {
          map.value.flyTo({
            center: coords,
            zoom: 15,
            duration: 1500
          })
          
          new maplibregl.Marker({ color: '#ef4444' })
            .setLngLat(coords)
            .setPopup(
              new maplibregl.Popup({ offset: 25 })
                .setHTML('<div style="padding: 8px; color: #000;"><strong>Tu ubicación</strong></div>')
            )
            .addTo(map.value)
          
          showNotification('Ubicación encontrada')
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        showNotification('No se pudo obtener tu ubicación', 'error')
      }
    )
  } else {
    showNotification('Geolocalización no disponible', 'error')
  }
}

const toggle3D = () => {
  show3D.value = !show3D.value
  if (map.value) {
    map.value.easeTo({
      pitch: show3D.value ? 60 : 0,
      duration: 1000
    })
  }
}

const toggleTerrain = () => {
  showTerrain.value = !showTerrain.value
  // Terrain 3D would require additional terrain source
  showNotification(showTerrain.value ? 'Terreno 3D activado' : 'Terreno 3D desactivado')
}

const printMap = () => {
  window.print()
}

const shareMap = () => {
  const center = map.value.getCenter()
  const zoom = map.value.getZoom()
  const url = `${window.location.origin}${window.location.pathname}#${zoom}/${center.lat.toFixed(4)}/${center.lng.toFixed(4)}`
  
  if (navigator.share) {
    navigator.share({
      title: 'GIS Pro Map',
      url: url
    })
  } else {
    navigator.clipboard.writeText(url)
    showNotification('URL copiada al portapapeles')
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const updateScale = () => {
  if (!map.value) return
  
  const zoom = map.value.getZoom()
  const maxWidth = 100
  const y = map.value.getContainer().clientHeight / 2
  
  const maxMeters = getDistance(
    map.value.unproject([0, y]),
    map.value.unproject([maxWidth, y])
  )
  
  const meters = getRoundNum(maxMeters)
  const ratio = meters / maxMeters
  
  scaleWidth.value = maxWidth * ratio
  scaleText.value = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km'
}

const getDistance = (latlng1, latlng2) => {
  const R = 6371000
  const rad = Math.PI / 180
  const lat1 = latlng1.lat * rad
  const lat2 = latlng2.lat * rad
  const a = Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad)
  return R * Math.acos(Math.min(a, 1))
}

const getRoundNum = (num) => {
  const pow10 = Math.pow(10, (Math.floor(num) + '').length - 1)
  let d = num / pow10
  d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1
  return pow10 * d
}

// Initialize map
onMounted(() => {
  isLoading.value = true

  try {
    const savedBaseLayer = localStorage.getItem('activeBaseLayer')
    if (savedBaseLayer) activeBaseLayer.value = savedBaseLayer
    const savedFiltersStr = localStorage.getItem('filters')
    if (savedFiltersStr) {
      const f = JSON.parse(savedFiltersStr)
      filterCalles.value = !!f.c
      filterManzanas.value = !!f.m
      filterParcelas.value = !!f.p
    }
  } catch {}
  
  // <CHANGE> Configurar mapa con OpenStreetMap y rotación de 90 grados
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
          maxzoom: 19
        }
      },
      layers: [{
        id: 'osm',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }]
    },
    center: [-56.6917, -36.5806],
    zoom: 13,
    minZoom: 0,
    maxZoom: 18,
    pitch: 60,
    bearing: -140, // Diagonal izquierda (~45°)
    attributionControl: false,
    logoPosition: 'bottom-right'
  })

  map.value.addControl(new maplibregl.AttributionControl({
    compact: true
  }), 'bottom-right')

  let coordUpdateTimeout
  map.value.on('mousemove', (e) => {
    clearTimeout(coordUpdateTimeout)
    coordUpdateTimeout = setTimeout(() => {
      currentCoords.value = {
        lat: e.lngLat.lat.toFixed(4),
        lng: e.lngLat.lng.toFixed(4)
      }
    }, 50)
  })

  map.value.on('zoom', () => {
    currentZoom.value = Math.round(map.value.getZoom())
    updateScale()
  })

  map.value.on('load', () => {
    isLoading.value = false
    addDrawnFeaturesSource()
    updateScale()
    if (activeBaseLayer.value && activeBaseLayer.value !== 'osm') {
      changeBaseLayer(activeBaseLayer.value)
    }
    showNotification('Mapa cargado correctamente')
  })

  map.value.on('click', handleMapClick)
  map.value.on('dblclick', handleMapDblClick)

  map.value.on('error', (e) => {
    console.error('Map error:', e)
    isLoading.value = false
  })
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.gis-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  color: #e5e5e5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, sans-serif;
  overflow: hidden;
}

.gis-header {
  background: linear-gradient(180deg, #141414 0%, #0f0f0f 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.logo-text h1 {
  font-size: 22px;
  font-weight: 700;
  color: #f5f5f5;
}

.logo-text p {
  font-size: 12px;
  color: #737373;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(31, 31, 31, 0.6);
  color: #a3a3a3;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-icon:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.gis-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.sidebar-toggle-external {
  position: absolute;
  left: 360px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 64px;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-left: none;
  border-radius: 0 8px 8px 0;
  color: #a3a3a3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s;
}

.sidebar-toggle-external.collapsed {
  left: 0;
}

.sidebar-toggle-external:hover {
  color: #3b82f6;
}

.gis-sidebar {
  width: 360px;
  background: rgba(15, 15, 15, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  z-index: 100;
}

.gis-sidebar.collapsed {
  width: 0;
  border-right: none;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-section {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #131313;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 6px 6px 6px 38px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #737373;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 8px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #e5e5e5;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  background: #0f172a;
  box-shadow: none;
}

.search-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  position: absolute;
  right: 10px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #737373;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.clear-btn:hover {
  background: #0f172a;
  color: #3b82f6;
}

.search-results {
  margin-top: 12px;
  background: #131313;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.search-result-item {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.search-result-item:hover {
  background: #0f172a;
}

.result-icon {
  color: #3b82f6;
}

.result-info {
  flex: 1;
}

.result-name {
  font-size: 14px;
  font-weight: 600;
  color: #e5e5e5;
}

.result-address {
  font-size: 12px;
  color: #737373;
}

.tabs {
  display: flex;
  padding: 16px 16px 0;
  gap: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab {
  flex: 1;
  padding: 10px 8px;
  background: transparent;
  border: none;
  color: #737373;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.03);
}

.tab.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

.tab-content::-webkit-scrollbar {
  width: 6px;
}

.tab-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.panel-title {
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #e5e5e5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.layers-panel, .tools-panel, .legend-panel, .info-panel {
  display: flex;
  flex-direction: column;
}

.layer-group, .tool-group {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.layer-group-header, .tool-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #a3a3a3;
  text-transform: uppercase;
}

.header-icon {
  color: #3b82f6;
}

.layer-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(31, 31, 31, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;
}

.layer-item:hover {
  background: rgba(31, 31, 31, 0.6);
}

.layer-item.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.layer-label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #e5e5e5;
}

.layer-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.layer-preview {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.layer-delete-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #737373;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.layer-delete-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.empty-hint {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #737373;
}

.tool-btn {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 8px;
  background: rgba(31, 31, 31, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: #e5e5e5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(31, 31, 31, 0.6);
  transform: translateX(2px);
}

.tool-btn.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.tool-btn.danger:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-icon {
  width: 36px;
  height: 36px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.tool-content {
  flex: 1;
  text-align: left;
}

.tool-name {
  font-size: 14px;
  font-weight: 600;
}

.tool-desc {
  font-size: 12px;
  color: #737373;
}

.measurements-list, .features-list {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.measurement-item, .feature-item {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: rgba(31, 31, 31, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.measurement-info, .feature-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.measurement-type, .feature-type {
  font-size: 12px;
  color: #737373;
}

.measurement-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.feature-id {
  font-size: 14px;
  color: #a3a3a3;
}

.measurement-delete, .feature-delete {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #737373;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.measurement-delete:hover, .feature-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.clear-measurements-btn {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-measurements-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.legend-group {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.legend-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #e5e5e5;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #a3a3a3;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-info {
  padding: 20px;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.feature-properties {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.property-row {
  display: flex;
  padding: 12px 14px;
  background: rgba(15, 15, 15, 0.6);
}

.property-key {
  flex: 0 0 120px;
  font-size: 12px;
  font-weight: 700;
  color: #a3a3a3;
}

.property-value {
  flex: 1;
  font-size: 14px;
  color: #e5e5e5;
}

.info-stats {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stats-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #e5e5e5;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-label {
  font-size: 13px;
  color: #a3a3a3;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
}

.empty-icon {
  margin: 0 auto 20px;
  opacity: 0.2;
  color: #3b82f6;
}

.empty-state p {
  font-size: 15px;
  font-weight: 600;
  color: #a3a3a3;
  margin-bottom: 8px;
}

.map-wrapper {
  flex: 1;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}

.active-tool-indicator {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.tool-indicator-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 6px;
}

.tool-cancel {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.tool-cancel:hover {
  background: rgba(239, 68, 68, 0.25);
}

.tool-hint {
  font-size: 12px;
  color: #a3a3a3;
  text-align: center;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 10;
}

.control-group {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.control-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: #a3a3a3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.control-btn:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.control-btn.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

.coordinates-display {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  font-family: monospace;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.coord-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coord-label {
  color: #737373;
  font-weight: 600;
}

.coord-value {
  color: #3b82f6;
  font-weight: 700;
}

.coord-separator {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
}

.scale-control {
  position: absolute;
  bottom: 65px;
  left: 20px;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10;
}



.scale-line {
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
}

.scale-text {
  font-size: 11px;
  color: #a3a3a3;
  font-weight: 600;
  font-family: monospace;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 1000;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.notification-toast {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3b82f6;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.notification-toast.error {
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  background: #141414;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.modal-header {
  padding: 24px;
  background: rgba(59, 130, 246, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #e5e5e5;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #737373;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.05);
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.help-section {
  margin-bottom: 24px;
}

.help-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.help-section ul {
  list-style: none;
  padding: 0;
}

.help-section li {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  font-size: 14px;
  color: #a3a3a3;
  line-height: 1.6;
}

.help-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .gis-sidebar {
    width: 300px;
  }
  
  .sidebar-toggle-external {
    left: 300px;
  }
  
  .logo-text p {
    display: none;
  }
}
/* === Responsive: layout & controls === */

/* Full height container adjustments */
html, body, #app {
  height: 100%;
}

.gis-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.gis-main {
  min-height: calc(100vh - 56px);
}

/* Tablet down (<= 1200px) */
@media (max-width: 1200px) {
  .gis-sidebar { width: 320px; }
  .sidebar-toggle-external { left: 320px; }
  .map-controls { gap: 12px; }
  .control-btn { width: 40px; height: 40px; }
}

/* Tablet (<= 1024px) */
@media (max-width: 1024px) {
  .gis-sidebar { width: 300px; }
  .sidebar-toggle-external { left: 300px; }
  .panel-title { font-size: 15px; }
  .tool-name { font-size: 13px; }
  .tool-desc { font-size: 11px; }
}

/* Mobile (<= 768px) — off-canvas sidebar, compact HUD */
@media (max-width: 768px) {
  .gis-main { overflow: visible; }
  .map-wrapper { height: 100%; }
  .map-container { height: 100%; }

  .gis-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 85vw;
    max-width: 360px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    z-index: 1500;
  }

  .gis-sidebar.collapsed {
    width: 85vw;
    transform: translateX(-100%);
    border-right: none;
  }

  .sidebar-toggle-external {
    top: 12px;
    left: 12px;
    transform: none;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    z-index: 2001;
  }

  .sidebar-toggle-external.collapsed {
    left: 12px;
  }

  .map-controls {
    top: auto;
    bottom: 16px;
    right: 12px;
    gap: 10px;
  }

  .control-btn {
    width: 36px;
    height: 36px;
  }

  .active-tool-indicator {
    top: 12px;
    left: 12px;
    right: 12px;
    transform: none;
    padding: 10px 14px;
  }

  .coordinates-display {
    left: 12px;
    bottom: 12px;
    padding: 8px 12px;
    gap: 8px;
    font-size: 11px;
  }

  .scale-control {
    left: 12px;
    bottom: 56px;
  }

  .search-results {
    max-height: 40vh;
  }

  .logo-text p {
    display: none;
  }
}

/* Small mobile (<= 480px) — tighter spacing */
@media (max-width: 480px) {
  .gis-sidebar {
    width: 90vw;
    max-width: 320px;
  }

  .map-controls { gap: 8px; }
  .control-btn { width: 32px; height: 32px; }

  .coord-separator { display: none; }
}

/* Safe-area support for notches */
@supports (padding: max(0px)) {
  .map-controls,
  .coordinates-display,
  .scale-control {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

.floating-search {
   position: absolute;
   top: 20px;
   left: 20px;
   width: 520px;
   z-index: 12;
 }
 .floating-search-row {
   display: flex;
   align-items: center;
   gap: 8px;
 }

.floating-results {
  position: relative;
}

.filter-chips {
  display: flex;
  gap: 8px;
  margin-top: 0;
  flex-wrap: nowrap;
  align-items: center;
  max-width: 240px;
  overflow-x: auto;
}

.chip {
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(31,31,31,0.7);
  color: #e5e5e5;
  cursor: pointer;
  transition: all 0.2s;
}

.chip:hover {
  background: rgba(59,130,246,0.12);
  color: #3b82f6;
}

.chip.active {
  background: rgba(59,130,246,0.18);
  color: #3b82f6;
  border-color: rgba(59,130,246,0.35);
}

.style-selector {
  position: relative;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: visible;
}

.style-options {
  position: absolute;
  top: 50%;
  right: calc(100% + 12px);
  left: auto;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-50%);
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 20;
}

.style-options.open {
  opacity: 1;
  transform: translateY(-50%);
  pointer-events: auto;
}

.style-chip {
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #131313;
  color: #eaeaea;
  cursor: pointer;
  white-space: nowrap;
}

.style-chip:hover {
  color: #3b82f6;
  border-color: #3b82f6;
  background: #0f172a;
}

.style-chip.active {
  color: #3b82f6;
  border-color: #3b82f6;
  background: #0f172a;
}

.gis-main {
  min-height: 100vh;
}
</style>
