<template>
  <q-dialog v-model="show">
    <q-card class="q-pa-lg" style="min-width: 400px;">
      <div class="text-h6 q-mb-md">Add New Task</div>

      <q-form @submit.prevent="onSubmit">
        <q-input
          filled
          v-model="form.name"
          label="Task Name"
          lazy-rules
          :rules="[val => !!val || 'Name is required']"
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
          <q-btn color="primary" label="Save" type="submit" :loading="loading" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { createTask } from 'src/libraries/api'
import { showError, showSuccess } from 'src/libraries/helper.js'

const show = defineModel({ type: Boolean })
const emit = defineEmits(['task-added'])
const loading = ref(false)
const form = reactive({
  name: '',
  description: '',
  status: 'TODO',
  note: '',
  created_by: localStorage.getItem('username') || 'unknown'
})

const onSubmit = async () => {
  if (!form.name) return

  loading.value = true
  try {
    const res = await createTask(form)
    if (res?.success) {
      showSuccess("Task added successfully!")
      emit('task-added')
      show.value = false

      form.name = ''
      form.description = ''
      form.status = 'PENDING'
      form.note = ''
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
