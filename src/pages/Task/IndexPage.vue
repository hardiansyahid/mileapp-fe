<template>
  <div class="q-pa-xl">
    <div class="flex justify-between items-center">
      <div class="text-h4">Tasks</div>
      <div>
        <q-btn color="primary" label="Add New Task" @click="showAddTask = true" />
        <add-task-dialog v-model="showAddTask" @task-added="fetchTasks" />
      </div>
    </div>

    <div class="q-mt-md">
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        :rows-per-page-options="[5, 10, 20]"
        @request="onRequest"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="500"
            v-model="filter"
            placeholder="Search task name"
            @update:model-value="onSearch"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.status === 'DONE' ? 'positive' : 'grey'"
              align="middle"
            >
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              flat
              dense
              round
              color="info"
              icon="visibility"
              @click="onDetail(props.row)"
              title="Detail"
            />
            <q-btn
              flat
              dense
              round
              color="warning"
              icon="edit"
              @click="onEdit(props.row)"
              title="Edit"
            />
            <q-btn
              flat
              dense
              round
              color="negative"
              icon="delete"
              @click="onDelete(props.row.id)"
              title="Delete"
            />
          </q-td>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing>
            <q-spinner color="primary" size="50px" />
          </q-inner-loading>
        </template>

        <template v-slot:no-data>
          <div class="text-grey text-center q-pa-md">
            No tasks found
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddTaskDialog from '../Components/TaskModalCreate.vue'
import { deleteTask, getTaskList } from 'src/libraries/api.js'
import { showError, showSuccess } from 'src/libraries/helper.js'

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Task Name', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'created_by', label: 'Created By', field: 'created_by', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const rows = ref([])
const loading = ref(false)
const filter = ref('')
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

const showAddTask = ref(false)

const fetchTasks = async () => {
  loading.value = true
  try {
    const res = await getTaskList({
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      keyword: filter.value || ''
    })

    const payload = res.data || {}
    rows.value = payload.results || []
    pagination.value.rowsNumber = payload.total || 0
    pagination.value.page = parseInt(payload.page) || 1
    pagination.value.rowsPerPage = parseInt(payload.per_page) || 5

  } catch (err) {
    showError("Gagal memuat data task")
    console.error('Error fetching tasks:', err)
  } finally {
    loading.value = false
  }
}

const onRequest = (props) => {
  pagination.value = props.pagination
  fetchTasks()
}

const onSearch = () => {
  pagination.value.page = 1
  fetchTasks()
}

const onDetail = (task) => {
  console.log('Detail clicked', task)
}

const onEdit = (task) => {
  console.log('Edit clicked', task)
}

const onDelete = async (id) => {
  try {
    const confirm = window.confirm('Yakin mau hapus task ini?')
    if (!confirm) return

    deleteTask(id)
      .then(() => {
        showSuccess("Task deleted successfully!")
      })
      .catch(err => {
        showError("Failed to delete task")
        console.error(err)
      })

    await fetchTasks()
  } catch (err) {
    showError('Gagal menghapus task')
    console.error(err)
  }
}

onMounted(fetchTasks)
</script>
