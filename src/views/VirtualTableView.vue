<template>
  <VirtualTable
    :table-data="tableData"
    :vt-config="vtConfig"
    :max-height="560"
    :max-width="1024"
    :row-height="rowHeight"
    :row-key="rowKey"
    :detail-key="detailKey"
    @update-vt-config="updateVtConfig"
    footer
    drag
  >
    <template v-slot="{ item, index }">
      <div :class="vtColClass(vtConfig, 'index')" :style="vtColStyle(vtConfig, 'index')">
        <div class="vt-cell">
          <span :title="String(index)">{{ index }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'id')" :style="vtColStyle(vtConfig, 'id')">
        <div class="vt-cell">
          <span :title="item.id">{{ item.id }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr1')" :style="vtColStyle(vtConfig, 'attr1')">
        <div class="vt-cell">
          <span :title="item.attr1">{{ item.attr1 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr2')" :style="vtColStyle(vtConfig, 'attr2')">
        <div class="vt-cell">
          <span :title="item.attr2">{{ item.attr2 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr3')" :style="vtColStyle(vtConfig, 'attr3')">
        <div class="vt-cell">
          <span :title="item.attr3">{{ item.attr3 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr4')" :style="vtColStyle(vtConfig, 'attr4')">
        <div class="vt-cell">
          <span :title="item.attr4">{{ item.attr4 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr5')" :style="vtColStyle(vtConfig, 'attr5')">
        <div class="vt-cell">
          <span :title="item.attr5">{{ item.attr5 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr6')" :style="vtColStyle(vtConfig, 'attr6')">
        <div class="vt-cell">
          <span :title="item.attr6">{{ item.attr6 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr7')" :style="vtColStyle(vtConfig, 'attr7')">
        <div class="vt-cell">
          <span :title="item.attr7">{{ item.attr7 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr8')" :style="vtColStyle(vtConfig, 'attr8')">
        <div class="vt-cell">
          <span :title="item.attr8">{{ item.attr8 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'attr9')" :style="vtColStyle(vtConfig, 'attr9')">
        <div class="vt-cell">
          <span :title="item.attr9">{{ item.attr9 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'detail1')" :style="vtColStyle(vtConfig, 'detail1')">
        <div class="vt-cell" v-for="(childItem, childIndex) in item[detailKey]" :key="childIndex">
          <span :title="childItem.detail1">{{ childItem.detail1 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'detail2')" :style="vtColStyle(vtConfig, 'detail2')">
        <div class="vt-cell" v-for="(childItem, childIndex) in item[detailKey]" :key="childIndex">
          <span :title="childItem.detail2">{{ childItem.detail2 }}</span>
        </div>
      </div>
      <div :class="vtColClass(vtConfig, 'operations')" :style="vtColStyle(vtConfig, 'operations')">
        <div class="vt-cell">
          <span title="详情" @click.stop="viewDetailFunc(index)" class="btn-text" :disabled="!(item.attr1.length >= 3)">详情</span>
          <span title="编辑" @click.stop="editFunc(index)" class="btn-text" :disabled="!(item.attr2.length >= 3)">编辑</span>
        </div>
      </div>
    </template>
  </VirtualTable>
  <button @click="initList(num)">重置</button>
</template>

<script setup lang="ts">
  import VirtualTable from "@/components/VirtualTable.vue";
  import { onMounted, ref } from "vue";
  import { generateRandomObject, vtColClass, vtColStyle } from "@/utils";
  import type { Ref } from "vue";

  const num = ref(10000);
  function initList(length: number) {
    tableData.value = [];
    for (let i = 0; i < length; i++) {
      tableData.value.push(generateRandomObject());
    }
  }
  onMounted(() => {
    initList(num.value);
  });

  const detailKey = "detail";
  const rowHeight = ref(28);
  const rowKey = "id";

  const tableData: Ref<any[]> = ref([]);

  const vtConfig: Ref<any[]> = ref([
    { label: "序号", prop: "index", width: "64px", align: "center", sum: "合计", fixed: { left: "0px" } },
    { label: "ID", prop: "id", width: "128px", fixed: { left: "64px" } },
    { label: "主单字段1", prop: "attr1", width: "128px", align: "right", sum: "quantity" },
    { label: "主单字段2", prop: "attr2", width: "128px" },
    { label: "主单字段3", prop: "attr3", width: "128px" },
    { label: "主单字段4", prop: "attr4", width: "128px" },
    { label: "主单字段5", prop: "attr5", width: "128px", align: "right", sum: "weight" },
    { label: "主单字段6", prop: "attr6", width: "128px" },
    { label: "主单字段7", prop: "attr7", width: "128px" },
    { label: "主单字段8", prop: "attr8", width: "128px" },
    { label: "主单字段9", prop: "attr9", width: "128px" },
    { label: "详单字段1", prop: "detail1", width: "128px", detail: detailKey },
    {
      label: "详单字段2",
      prop: "detail2",
      width: "128px",
      align: "right",
      sum: "money",
      detail: detailKey,
      fixed: { right: "81px" },
      outline: "outline",
    },
    { label: "操作", prop: "operations", width: "81px", fixed: { right: "0px" } },
  ]);
  updateVtConfig(null);

  function updateVtConfig(newVtConfig: any[] | null) {
    if (newVtConfig) {
      vtConfig.value = newVtConfig;
    }
    vtConfig.value.forEach((item: any, index) => {
      item.order = index + 1;
    });
  }

  function viewDetailFunc(index: number) {
    console.log(`第${index}行详情`);
  }
  function editFunc(index: number) {
    console.log(`第${index}行编辑`);
  }
</script>

<style scoped lang="scss"></style>
