<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-input v-model="tempData.name" label="姓名" />
        <q-input v-model="tempData.age" label="年齡" />
        <q-btn color="primary" class="q-mt-md" @click="addData">新增</q-btn>
      </div>

      <q-table
        flat
        bordered
        ref="tableRef"
        :rows="blockData"
        :columns="(tableConfig as QTableProps['columns'])"
        row-key="id"
        hide-pagination
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="min-width: 120px"
            >
              <div>{{ props.row[col.field] }}</div>
            </q-td>
            <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
              <q-btn
                @click="handleClickOption(btn, props.row)"
                v-for="(btn, index) in tableButtons"
                :key="index"
                size="sm"
                color="grey-6"
                round
                dense
                :icon="btn.icon"
                class="q-ml-md"
                padding="5px 5px"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ btn.label }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon }">
          <div
            class="full-width row flex-center items-center text-primary q-gutter-sm"
            style="font-size: 18px"
          >
            <q-icon size="2em" :name="icon" />
            <span> 無相關資料 </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { QTableProps } from 'quasar';
import { ref, onMounted } from 'vue';

interface btnType {
  label: string;
  icon: string;
  status: string;
}

const API_URL = 'https://dahua.metcfire.com.tw/api/CRUDTest';

const blockData = ref([]);
const tempData = ref({
  name: '',
  age: '',
});

const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);

const tableButtons = ref([
  {
    label: '編輯',
    icon: 'edit',
    status: 'edit',
  },
  {
    label: '刪除',
    icon: 'delete',
    status: 'delete',
  },
]);

// Function to fetch data from API
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_URL}/a`);
    blockData.value = response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Function to add new data
const addData = async () => {
  if (!tempData.value.name || !tempData.value.age) {
    alert("請填寫姓名和年齡");
    return;
  }
  try {
    const response = await axios.post(API_URL, tempData.value);
    blockData.value.push(response.data);
    tempData.value.name = '';
    tempData.value.age = '';
  } catch (error) {
    console.error("Error adding data:", error);
  }
};

// Function to update data
const updateData = async (id) => {
  try {
    await axios.patch(`${API_URL}/${id}`, tempData.value);
    await fetchData();
    tempData.value.name = '';
    tempData.value.age = '';
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

// Function to delete data
const deleteData = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    blockData.value = blockData.value.filter((item) => item.id !== id);
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

// Function to handle button actions
const handleClickOption = (btn, data) => {
  if (btn.status === 'edit') {
    tempData.value = { name: data.name, age: data.age };
    updateData(data.id); // Call update function
  } else if (btn.status === 'delete') {
    deleteData(data.id); // Call delete function
  }
};

// Fetch data when the component is mounted
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
