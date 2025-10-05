<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn color="dark" flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-dark">  </q-toolbar-title>

        <q-avatar
          class="cursor-pointer"
          @click="menu = !menu"
          size="35px"
          :style="{ backgroundColor: bgColor, color: textColor }"
        >
          {{ getInitials(name) }}
        </q-avatar>

      </q-toolbar>
    </q-header>

    <q-menu
      v-model="menu"
      anchor="bottom right"
      self="top right"
      :auto-close="true"
    >
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <div class="text-center q-py-lg">
          <img src="/mileapp.webp" alt="logo" class="logo">
        </div>

        <q-list>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple @click="gotoUrl(menuItem.url)">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
          </template>

          <q-item clickable v-ripple @click="doLogout()">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              Logout
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from 'src/libraries/api.js'
import { showError, showSuccess } from 'src/libraries/helper.js'

const name = 'Hardiansyah'
const bgColor = ref('')
const textColor = ref('#2d2d2d')

const leftDrawerOpen = ref(false)
const menu = ref(false)
const router = useRouter()

const menuList = [
  {
    icon: 'inbox',
    label: 'Tasks',
    url: '/task',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Settings',
    url: '/',
    separator: false
  },
  {
    icon: 'people',
    label: 'Account',
    url: '/',
    separator: false
  },
  {
    icon: 'help',
    iconColor: 'primary',
    label: 'Help',
    url: '/',
    separator: true
  }
]


function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  bgColor.value = getRandomPastelColor()
  textColor.value = getContrastColor(bgColor.value)
})


function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 70 + Math.random() * 10 // soft color
  const lightness = 80 + Math.random() * 10  // pastel vibe
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function getContrastColor(bgColor) {
  const hsl = bgColor.match(/\d+/g)
  if (!hsl) return '#222'
  const [, , l] = hsl.map(Number)
  return l > 70 ? '#333' : '#fff'
}

function gotoUrl(url) {
  router.push({ path: url })
}

const doLogout = () => {
  logout().then(() => {
    router.push({ path: '/login' })
    showSuccess("Logout successfully.")
  }).catch(err => {
    showError(err)
    console.error(err)
  })
}

</script>
