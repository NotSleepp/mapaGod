<template>
  <div class="gis-container">
    <!-- Header -->
    <header class="gis-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1>GIS</h1>
            <p>Sistema de Información Geográfica</p>
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
      <!-- Sidebar Toggle Button - Always visible -->
      <button class="sidebar-toggle-external" @click="sidebarCollapsed = !sidebarCollapsed" :class="{ collapsed: sidebarCollapsed }">
        <ChevronLeft v-if="!sidebarCollapsed" :size="20" />
        <ChevronRight v-else :size="20" />
      </button>

      <!-- Sidebar -->
      <aside class="gis-sidebar" :class="{ collapsed: sidebarCollapsed }">
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
                @input="performSearch"
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
                    <span>Capas Base</span>
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
                    </div>
                  </div>
                </div>

                <div class="layer-group">
                  <div class="layer-group-header">
                    <div class="header-icon">
                      <Layers :size="16" />
                    </div>
                    <span>Capas Temáticas</span>
                  </div>
                  <div class="layer-items">
                    <div 
                      v-for="layer in thematicLayers" 
                      :key="layer.id"
                      class="layer-item"
                      :class="{ active: layer.visible }"
                    >
                      <label class="layer-label">
                        <input 
                          type="checkbox" 
                          v-model="layer.visible"
                          @change="toggleLayer(layer.id)"
                        />
                        <span class="layer-name">{{ layer.name }}</span>
                      </label>
                      <button 
                        class="layer-info-btn"
                        @click="showLayerInfo(layer)"
                        title="Información"
                      >
                        <Info :size="14" />
                      </button>
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
                      <div class="tool-desc">Dibujar línea</div>
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
                </div>

                <div v-if="measurements.length > 0" class="measurements-list">
                  <h4 class="tool-group-title">Mediciones</h4>
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
                </div>
              </div>

              <!-- Legend Tab -->
              <div v-else-if="activeTab === 'legend'" key="legend" class="legend-panel">
                <h3 class="panel-title">
                  <Map :size="20" />
                  <span>Leyenda</span>
                </h3>
                
                <div v-for="layer in thematicLayers.filter(l => l.visible)" :key="layer.id" class="legend-group">
                  <h4 class="legend-title">{{ layer.name }}</h4>
                  <div class="legend-items">
                    <div v-for="item in layer.legend" :key="item.label" class="legend-item">
                      <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                      <span class="legend-label">{{ item.label }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="thematicLayers.filter(l => l.visible).length === 0" class="empty-state">
                  <Map :size="48" class="empty-icon" />
                  <p>No hay capas visibles</p>
                  <span class="empty-hint">Activa capas desde la pestaña "Capas"</span>
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
              </div>
            </transition>
          </div>
        </div>
      </aside>

      <!-- Map Container -->
      <div class="map-wrapper">
        <div ref="mapContainer" class="map-container"></div>

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
            <button class="control-btn" @click="printMap" title="Imprimir">
              <Printer :size="20" />
            </button>
            <button class="control-btn" @click="shareMap" title="Compartir">
              <Share2 :size="20" />
            </button>
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
      </div>
    </div>

    <!-- Help Modal -->
    <transition name="modal">
      <div v-if="showHelp" class="modal-overlay" @click="showHelp = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Ayuda - Sistema GIS</h2>
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
                <li>Mantén Shift y arrastra para rotar</li>
              </ul>
            </div>
            <div class="help-section">
              <h3>Herramientas</h3>
              <ul>
                <li>Medir: Calcula distancias y áreas</li>
                <li>Dibujar: Agrega marcadores y formas</li>
                <li>Capas: Activa/desactiva información</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { 
  Search, X, MapPin, Layers, Map, Info, HelpCircle, Maximize2,
  ChevronLeft, ChevronRight, Ruler, Square, Minus, Pentagon,
  Circle, Activity, Plus, Home, Navigation, Box, Printer, Share2
} from 'lucide-vue-next'

// State
const mapContainer = ref(null)
const map = ref(null)
const sidebarCollapsed = ref(false)
const activeTab = ref('layers')
const searchQuery = ref('')
const searchResults = ref([])
const activeTool = ref(null)
const measurements = ref([])
const selectedFeature = ref(null)
const showHelp = ref(false)
const isLoading = ref(true)
const show3D = ref(false)
const currentCoords = ref({ lat: '-36.5806', lng: '-56.6917' })
const currentZoom = ref(13)
const scaleWidth = ref(100)
const scaleText = ref('1 km')
const activeBaseLayer = ref('streets')

// Tabs configuration
const tabs = [
  { id: 'layers', label: 'Capas', icon: Layers },
  { id: 'tools', label: 'Herramientas', icon: Ruler },
  { id: 'legend', label: 'Leyenda', icon: Map },
  { id: 'info', label: 'Info', icon: Info }
]

// Base layers
const baseLayers = [
  { id: 'streets', name: 'Calles', url: 'https://api.maptiler.com/maps/streets-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL' },
  { id: 'satellite', name: 'Satélite', url: 'https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL' },
  { id: 'terrain', name: 'Terreno', url: 'https://api.maptiler.com/maps/outdoor-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL' },
  { id: 'dark', name: 'Oscuro', url: 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL' }
]

// Thematic layers
const thematicLayers = ref([
  { 
    id: 'schools', 
    name: 'Escuelas', 
    visible: true,
    legend: [
      { color: '#3b82f6', label: 'Escuela Primaria' },
      { color: '#8b5cf6', label: 'Escuela Secundaria' },
      { color: '#ec4899', label: 'Universidad' }
    ]
  },
  { 
    id: 'hospitals', 
    name: 'Hospitales', 
    visible: false,
    legend: [
      { color: '#ef4444', label: 'Hospital General' },
      { color: '#f97316', label: 'Clínica' }
    ]
  },
  { 
    id: 'parks', 
    name: 'Parques', 
    visible: false,
    legend: [
      { color: '#22c55e', label: 'Parque Público' },
      { color: '#84cc16', label: 'Reserva Natural' }
    ]
  }
])

// Methods
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  // Simulated search results
  searchResults.value = [
    {
      id: 1,
      name: 'Plaza Principal',
      address: 'Centro, Buenos Aires',
      coords: [-56.6917, -36.5806]
    },
    {
      id: 2,
      name: 'Parque Central',
      address: 'Zona Norte, Buenos Aires',
      coords: [-56.6800, -36.5700]
    }
  ]
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
  }
  searchResults.value = []
}

const changeBaseLayer = (layerId) => {
  const layer = baseLayers.find(l => l.id === layerId)
  if (layer && map.value) {
    // In a real implementation, you would change the map style here
    console.log('Changing base layer to:', layer.name)
  }
}

const toggleLayer = (layerId) => {
  const layer = thematicLayers.value.find(l => l.id === layerId)
  if (layer && map.value) {
    console.log('Toggling layer:', layer.name, layer.visible)
  }
}

const showLayerInfo = (layer) => {
  selectedFeature.value = {
    name: layer.name,
    properties: {
      'Tipo': 'Capa Temática',
      'Estado': layer.visible ? 'Visible' : 'Oculta',
      'Elementos': Math.floor(Math.random() * 100) + 10
    }
  }
  activeTab.value = 'info'
}

const activateTool = (tool) => {
  activeTool.value = activeTool.value === tool ? null : tool
  console.log('Tool activated:', tool)
}

const deleteMeasurement = (index) => {
  measurements.value.splice(index, 1)
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
      pitch: 0,
      bearing: -90,
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
            .addTo(map.value)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
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

const printMap = () => {
  window.print()
}

const shareMap = () => {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({
      title: 'GIS Map',
      url: url
    })
  } else {
    navigator.clipboard.writeText(url)
    alert('URL copiada al portapapeles')
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

const addSampleMarkers = () => {
  const markers = [
    { coords: [-56.6917, -36.5806], color: '#3b82f6', name: 'Ubicación Principal' },
    { coords: [-56.6800, -36.5700], color: '#8b5cf6', name: 'Punto de Interés 1' },
    { coords: [-56.7000, -36.5900], color: '#ec4899', name: 'Punto de Interés 2' }
  ]
  
  markers.forEach(marker => {
    new maplibregl.Marker({ color: marker.color })
      .setLngLat(marker.coords)
      .setPopup(
        new maplibregl.Popup({ offset: 25 })
          .setHTML(`<div style="padding: 8px;"><strong>${marker.name}</strong></div>`)
      )
      .addTo(map.value)
  })
}

const addSampleLayers = () => {
  // Add sample GeoJSON layers here if needed
  console.log('Sample layers added')
}

// Initialize map
onMounted(() => {
  isLoading.value = true
  
  // Optimized map initialization
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
    pitch: 0,
    bearing: -90,
    // Performance optimizations
    attributionControl: false,
    logoPosition: 'bottom-right',
    refreshExpiredTiles: false,
    fadeDuration: 0,
    crossSourceCollisions: false
  })

  // Remove default controls to avoid duplicates
  // We're using custom controls instead

  // Update coordinates on mouse move (throttled for performance)
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

  // Update zoom level
  map.value.on('zoom', () => {
    currentZoom.value = Math.round(map.value.getZoom())
    updateScale()
  })

  // Add sample markers and layers when map loads
  map.value.on('load', () => {
    isLoading.value = false
    addSampleMarkers()
    addSampleLayers()
    updateScale()
  })

  // Handle map errors
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.gis-header {
  background: linear-gradient(180deg, #141414 0%, #0f0f0f 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.6);
}

.logo-text h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #f5f5f5;
  letter-spacing: -0.8px;
  background: linear-gradient(135deg, #f5f5f5 0%, #a3a3a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-text p {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: #737373;
  font-weight: 500;
  letter-spacing: 0.3px;
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
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.btn-icon:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-icon:active {
  transform: translateY(0);
}

/* Main Layout */
.gis-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

/* External Sidebar Toggle - Always visible */
.sidebar-toggle-external {
  position: absolute;
  left: 320px;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3);
}

.sidebar-toggle-external.collapsed {
  left: 0;
}

.sidebar-toggle-external:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #3b82f6;
  width: 36px;
}

/* Sidebar */
.gis-sidebar {
  width: 320px;
  background: rgba(15, 15, 15, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
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

/* Search Section */
.search-section {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #737373;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  background: rgba(31, 31, 31, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #e5e5e5;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  background: rgba(31, 31, 31, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #737373;
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
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e5e5e5;
}

/* Search Results */
.search-results {
  margin-top: 12px;
  background: rgba(31, 31, 31, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
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

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.result-icon {
  color: #3b82f6;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 14px;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: 2px;
}

.result-address {
  font-size: 12px;
  color: #737373;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-arrow {
  color: #737373;
  flex-shrink: 0;
}

/* Tabs */
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #a3a3a3;
}

.tab.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.tab-content::-webkit-scrollbar {
  width: 6px;
}

.tab-content::-webkit-scrollbar-track {
  background: transparent;
}

.tab-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Panel Title */
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

/* Layers Panel */
.layers-panel {
  display: flex;
  flex-direction: column;
}

.layer-group {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.layer-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  border-color: rgba(255, 255, 255, 0.1);
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

.layer-label input[type="checkbox"],
.layer-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.layer-info-btn {
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

.layer-info-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

/* Tools Panel */
.tools-panel {
  display: flex;
  flex-direction: column;
}

.tool-group {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tool-group-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.tool-btn:last-child {
  margin-bottom: 0;
}

.tool-btn:hover {
  background: rgba(31, 31, 31, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.tool-btn.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
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
  flex-shrink: 0;
}

.tool-content {
  flex: 1;
  text-align: left;
}

.tool-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.tool-desc {
  font-size: 12px;
  color: #737373;
}

/* Measurements List */
.measurements-list {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.measurement-item {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: rgba(31, 31, 31, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.measurement-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.measurement-type {
  font-size: 12px;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.measurement-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.measurement-delete {
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

.measurement-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Legend Panel */
.legend-panel {
  display: flex;
  flex-direction: column;
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
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Info Panel */
.info-panel {
  display: flex;
  flex-direction: column;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.property-row:last-child {
  border-bottom: none;
}

.property-key {
  flex: 0 0 120px;
  font-size: 12px;
  font-weight: 700;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-value {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #e5e5e5;
}

/* Empty State */
.empty-state {
  padding: 60px 24px;
  text-align: center;
  color: #737373;
}

.empty-icon {
  margin: 0 auto 20px;
  opacity: 0.2;
  color: #3b82f6;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #a3a3a3;
}

.empty-hint {
  font-size: 13px;
  color: #737373;
  font-weight: 400;
}

/* Map */
.map-wrapper {
  flex: 1;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* Hide default MapLibre controls */
.map-container :deep(.maplibregl-ctrl-top-right),
.map-container :deep(.maplibregl-ctrl-bottom-left),
.map-container :deep(.maplibregl-ctrl-bottom-right) {
  display: none !important;
}

/* Map Controls */
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
  backdrop-filter: blur(20px);
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.control-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.control-btn:hover {
  color: #3b82f6;
  transform: scale(1.05);
}

.control-btn:hover::before {
  opacity: 1;
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

/* Coordinates Display */
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
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

/* Scale Control */
.scale-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  z-index: 10;
}

.scale-line {
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s;
}

.scale-text {
  font-size: 11px;
  color: #a3a3a3;
  font-weight: 600;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
}

/* Loading Overlay */
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
  backdrop-filter: blur(10px);
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

.loading-overlay p {
  font-size: 14px;
  color: #a3a3a3;
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(8px);
}

.modal-content {
  width: 90%;
  max-width: 500px;
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
  margin: 0;
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
  color: #e5e5e5;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.help-section {
  margin-bottom: 24px;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.help-section ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
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
  font-weight: bold;
}

/* Transitions */
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
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .gis-sidebar {
    width: 280px;
  }
  
  .sidebar-toggle-external {
    left: 280px;
  }
  
  .logo-text p {
    display: none;
  }
  
  .coordinates-display {
    font-size: 10px;
    padding: 8px 12px;
    gap: 12px;
  }
}
</style>