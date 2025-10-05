<template>
  <q-dialog v-model="show">
    <q-card class="q-pa-lg" style="min-width: 400px">
      <div class="text-h6 q-mb-md">Add New Task</div>

      <q-form @submit.prevent="onSubmit">
        <q-input
          filled
          v-model="form.name"
          label="Task Name"
          lazy-rules
          :rules="[(val) => !!val || 'Name is required']"
          class="q-mb-md"
        />

        <q-input
          filled
          v-model="form.description"
          type="textarea"
          label="Description"
          autogrow
          class="q-mb-md"
        />

        <q-select
          filled
          v-model="form.status"
          label="Status"
          :options="['TODO', 'INPROGRESS', 'DONE']"
          class="q-mb-md"
        />

        <div class="flex justify-end q-gutter-sm">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Update" type="submit" :loading="loading" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { updateTask } from 'src/libraries/api'
import { showError, showSuccess } from 'src/libraries/helper.js'

const show = defineModel({ type: Boolean })
const idTask = ref(null)
const props = defineProps({
  task: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['task-added'])
const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  status: 'TODO',
  note: '',
  created_by: localStorage.getItem('username') || 'unknown',
})

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.status = 'TODO'
  form.note = ''
}

const populateTask = (taskData) => {
  if (taskData && Object.keys(taskData).length > 0) {
    form.name = taskData.name || ''
    form.description = taskData.description || ''
    form.status = taskData.status || 'TODO'
    form.note = taskData.note || ''
  } else {
    resetForm()
  }
}

watch(
  () => props.task,
  (newTask) => {
    populateTask(newTask)
    idTask.value = newTask.id
  },
  { immediate: true },
)

const onSubmit = async () => {
  if (!form.name.trim()) return showError('Name is required')

  loading.value = true
  try {
    const res = await updateTask(idTask.value, form)
    if (res?.success) {
      showSuccess('Task added successfully!')
      emit('task-added')
      show.value = false
      resetForm()
    } else {
      throw new Error(res?.message || 'Failed to add task')
    }
  } catch (err) {
    showError(err.message || 'Error adding task')
  } finally {
    loading.value = false
  }
}
</script>
