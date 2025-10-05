<template>
  <q-dialog v-model="show">
    <q-card class="q-pa-lg" style="min-width: 400px">
      <div class="text-h6 q-mb-md">Detail Task</div>

      <div class="q-mb-md">
        <div><b>ID:</b> {{ task?.id }}</div>
        <div><b>Nama:</b> {{ task?.name }}</div>
        <div><b>Status:</b> {{ task?.status }}</div>
        <div><b>Description:</b> {{ task?.description }}</div>
      </div>

      <div class="flex justify-end q-gutter-sm">
        <q-btn flat label="Close" v-close-popup />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { watch } from 'vue'

const show = defineModel({ type: Boolean })
const props = defineProps({
  task: {
    type: Object,
    default: () => ({}),
  },
})

watch(
  () => props.task,
  (newTask) => {
    if (newTask && Object.keys(newTask).length > 0) {
      console.log('Task updated:', newTask)
    }
  },
  { immediate: true }
)
</script>
