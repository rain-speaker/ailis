<template>
  <VirtualTable
    :list
    :max-height="560"
    :max-width="1600"
    :row-height="rowHeight"
    :detail-key="detailKey"
    :vt-config="vtConfig"
    @reorder="reorderElements"
  >
    <template v-slot="{ item, index }">
      <div class="row">
        <div :class="vtcc(vtConfig, 'index')" :style="vtcs(vtConfig, 'index')">
          <div class="cell">
            <span :title="String(index)">{{ index }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr1')" :style="vtcs(vtConfig, 'attr1')">
          <div class="cell">
            <span :title="item.attr1">{{ item.attr1 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr2')" :style="vtcs(vtConfig, 'attr2')">
          <div class="cell">
            <span :title="item.attr2">{{ item.attr2 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr3')" :style="vtcs(vtConfig, 'attr3')">
          <div class="cell">
            <span :title="item.attr3">{{ item.attr3 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr4')" :style="vtcs(vtConfig, 'attr4')">
          <div class="cell">
            <span :title="item.attr4">{{ item.attr4 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr5')" :style="vtcs(vtConfig, 'attr5')">
          <div class="cell">
            <span :title="item.attr5">{{ item.attr5 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr6')" :style="vtcs(vtConfig, 'attr6')">
          <div class="cell">
            <span :title="item.attr6">{{ item.attr6 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr7')" :style="vtcs(vtConfig, 'attr7')">
          <div class="cell">
            <span :title="item.attr7">{{ item.attr7 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr8')" :style="vtcs(vtConfig, 'attr8')">
          <div class="cell">
            <span :title="item.attr8">{{ item.attr8 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'attr9')" :style="vtcs(vtConfig, 'attr9')">
          <div class="cell">
            <span :title="item.attr9">{{ item.attr9 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'detail1')" :style="vtcs(vtConfig, 'detail1')">
          <div class="cell" v-for="(childItem, childIndex) in item[detailKey]" :key="childIndex">
            <span :title="childItem.detail1">{{ childItem.detail1 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'detail2')" :style="vtcs(vtConfig, 'detail2')">
          <div class="cell" v-for="(childItem, childIndex) in item[detailKey]" :key="childIndex">
            <span :title="childItem.detail2">{{ childItem.detail2 }}</span>
          </div>
        </div>
        <div :class="vtcc(vtConfig, 'operations')" :style="vtcs(vtConfig, 'operations')">
          <div class="cell">
            <span title="详情" @click.stop="viewDetailFunc(index)" class="btn-text" :disabled="!(item.attr2.length >= 3)">详情</span>
            <span title="编辑" @click.stop="editFunc(index)" class="btn-text" :disabled="!(item.attr2.length <= 4)">编辑</span>
          </div>
        </div>
      </div>
    </template>
  </VirtualTable>
  <button @click="initList(num)">重置</button>
</template>

<script setup lang="ts">
  import { generateRandomObject, vtcc, vtcs } from "@/utils";
  import { onMounted, ref } from "vue";
  import type { Ref } from "vue";
  import VirtualTable from "@/components/VirtualTable.vue";

  const num = ref(10000);

  const detailKey = "detail";
  const rowHeight = ref(28);

  const vtConfig = ref([
    { label: "序号", type: "index", width: "64px", align: "center", sum: "合计", fixed: { left: "0px" }, order: "1" },
    { label: "主单字段1", prop: "attr1", width: "128px", align: "right", sum: "quantity", order: "2" },
    { label: "主单字段2", prop: "attr2", width: "128px", order: "3" },
    { label: "主单字段3", prop: "attr3", width: "128px", order: "4" },
    { label: "主单字段4", prop: "attr4", width: "128px", order: "5" },
    { label: "主单字段5", prop: "attr5", width: "128px", align: "right", sum: "weight", order: "6" },
    { label: "主单字段6", prop: "attr6", width: "128px", order: "7" },
    { label: "主单字段7", prop: "attr7", width: "128px", order: "8" },
    { label: "主单字段8", prop: "attr8", width: "128px", order: "9" },
    { label: "主单字段9", prop: "attr9", width: "128px", order: "10" },
    { label: "详单字段1", prop: "detail1", width: "128px", detail: detailKey, order: "11" },
    {
      label: "详单字段2",
      prop: "detail2",
      width: "128px",
      align: "right",
      sum: "money",
      detail: detailKey,
      fixed: { right: "81px" },
      outline: "outline",
      order: "12",
    },
    { label: "操作", type: "operations", width: "81px", fixed: { right: "0px" }, order: "13" },
  ]);

  const list: Ref<any[]> = ref([]);

  function initList(length: number) {
    list.value = [];
    for (let i = 0; i < length; i++) {
      list.value.push(generateRandomObject());
    }
  }

  onMounted(() => {
    initList(num.value);
  });

  function viewDetailFunc(index: number) {
    console.log(`第${index}行详情`);
  }
  function editFunc(index: number) {
    console.log(`第${index}行编辑`);
  }

  function reorderElements(source: string, target: string) {
    if (!source || !target) {
      return;
    }
    // 复制列表
    const updatedList = JSON.parse(JSON.stringify(vtConfig.value));

    // 提取源元素和目标元素
    const sourceItem = updatedList.find((item: any) => item.prop === source || item.type === source);
    const targetItem = updatedList.find((item: any) => item.prop === target || item.type === target);

    if (sourceItem?.fixed || targetItem?.fixed) {
      return;
    }

    const sourceIndex1 = updatedList.findIndex((item: any) => item.prop === source || item.type === source);
    const targetIndex1 = updatedList.findIndex((item: any) => item.prop === target || item.type === target);

    const fix = sourceIndex1 < targetIndex1 ? 1 : 0;

    const sourceIndex2 = updatedList.findIndex((item: any) => item.prop === source || item.type === source);
    const removed = updatedList.splice(sourceIndex2, 1)[0];

    const targetIndex2 = updatedList.findIndex((item: any) => item.prop === target || item.type === target) + fix;
    updatedList.splice(targetIndex2, 0, removed);

    updatedList.forEach((item: any, index: number) => {
      item.order = `${index + 1}`;
    });

    vtConfig.value = JSON.parse(JSON.stringify(updatedList));
  }
</script>

<style scoped lang="scss"></style>
