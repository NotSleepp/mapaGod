<template>
  <main>
    <v-toolbar color="#6a8bc3" extended flat></v-toolbar>
    <v-card class="mx-auto" max-width="700" style="margin-top: -70px;">
      <v-toolbar flat style="padding: 0 20px;">
        <p class="font-weight-bold font-italic">Filtro de Búsqueda:</p>
        <v-radio-group v-model="checkbusqueda" inline hide-details>
          <v-radio label="Por Fecha" value="1"></v-radio>
          <v-radio label="Por Cuenta" value="2"></v-radio>
          <v-radio label="Por N° de Trámite" value="3"></v-radio>
        </v-radio-group>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="padding: 0 20px;">
        <v-row class="align-center">
          <v-col cols="9" v-if="checkbusqueda == 1">
            <v-text-field
              v-model="datebusqueda"
              label="Fecha Inicio - Fecha Fin"
              prepend-icon="mdi-calendar-multiple"
              type="date" 
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="9" v-if="checkbusqueda == 2">
            <v-text-field
              variant="underlined"
              v-model="cuentabusqueda"
              label="Cuenta"
            ></v-text-field>
          </v-col>
          <v-col cols="9" v-if="checkbusqueda == 3">
            <v-text-field
              variant="underlined"
              v-model="numtramitebusqueda"
              label="N° de Trámite"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="#6a8bc3">BUSCAR</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-col cols="12">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="desserts"
        item-value="name"
        class="elevation-1"
      ></v-data-table>
    </v-col>
  </main>
</template>

<script>
export default {
  data: () => ({
    checkbusqueda: "1",
    datebusqueda: [],
    menubusqueda: false,
    itemsPerPage: 5,
    headers: [
      {
        title: 'Nº de tramite',
        align: 'start',
        sortable: false,
        key: 'tramite',
      },
      { title: 'Cuenta', align: 'end', key: 'Cuenta' },
      { title: 'Profesional', align: 'end', key: 'Profesional' },
      { title: 'N° Catastral', align: 'end', key: 'Catastral' },
      { title: 'Fecha', align: 'end', key: 'Fecha' },
      { title: 'Estado', align: 'end', key: 'Estado' },
      { title: 'Opciones', align: 'end', key: 'actions',sortable: false },
    ],
    desserts: [],
  }),
};
</script>
