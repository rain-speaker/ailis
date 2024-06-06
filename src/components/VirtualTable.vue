<template>
  <div
    ref="virtualTableContainer"
    class="virtual-table-container"
    :style="{ maxHeight: `${maxHeight}px`, maxWidth: `${maxWidth}px` }"
    @scroll="main()"
  >
    <div class="virtual-table" :style="{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }">
      <div class="virtual-table-item virtual-table-header">
        <slot name="header">
          <div class="virtual-table-row">
            <div
              v-for="item in vtConfig"
              :key="item.prop"
              :class="vtColClass(vtConfig, item.prop)"
              :style="vtColStyle(vtConfig, item.prop)"
              :draggable="!item.fixed && drag"
              @dragstart="dragStartFunc"
              @drop="dropFunc"
              @dragenter="dragEnterFunc"
              @dragover="dragOverFunc"
            >
              <div class="vt-cell">
                <span :title="item.label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <template v-for="(item, index) in tableData" :key="item[rowKey]">
        <div
          class="virtual-table-item"
          :class="{ highlight: highlightedRows.includes(index) }"
          @click="highlightFunc(index)"
          v-if="index >= startIndex && index <= endIndex"
        >
          <div class="virtual-table-row">
            <slot :item="item" :index="index"></slot>
          </div>
        </div>
      </template>

      <div class="virtual-table-item virtual-table-footer" v-if="footer">
        <slot name="footer">
          <div class="virtual-table-row">
            <div
              v-for="item in vtConfig"
              :key="item.prop"
              :class="vtColClass(vtConfig, item.prop)"
              :style="vtColStyle(vtConfig, item.prop)"
            >
              <div class="vt-cell">
                <span :title="footerData[item.prop]" v-if="footerData">{{ footerData[item.prop] }}</span>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import { vtColClass, vtColStyle, vtFooterData } from "@/utils";
  import type { Ref, PropType } from "vue";

  const props = defineProps({
    tableData: {
      type: Array as PropType<any[]>,
      required: true,
    },
    maxHeight: {
      type: Number,
      required: true,
    },
    maxWidth: {
      type: Number,
      required: true,
    },
    rowHeight: {
      type: Number,
      required: true,
    },
    rowKey: {
      type: String,
      required: true,
    },
    detailKey: {
      type: String,
      required: false,
      default: "",
    },
    footer: {
      type: Boolean,
      required: false,
      default: false,
    },
    drag: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const vtConfig: any = defineModel("vtConfig");

  onMounted(() => {
    watch(
      () => props.tableData,
      () => {
        init();
      },
    );
  });

  const virtualTableContainer = ref();

  const startIndex = ref(0);
  const endIndex = ref(0);

  const paddingTop = ref(0);
  const paddingBottom = ref(0);

  const rowHeights: Ref<number[]> = ref([]);
  const AuxiliaryRowHeights: Ref<number[]> = ref([]);

  const tableDataLength = ref(0);

  const lastScrollTop = ref(0);

  const footerData = ref();

  const highlightedRows: Ref<number[]> = ref([]);

  function init() {
    tableDataLength.value = props.tableData.length;

    props.tableData.forEach((item, index) => {
      const detailLength = props.detailKey ? item[props.detailKey].length : 1;
      rowHeights.value[index] = props.rowHeight * detailLength;
    });

    let sum = 0;
    rowHeights.value.forEach((item, index) => {
      sum += item;
      AuxiliaryRowHeights.value[index] = sum;
    });

    if (props.footer) {
      footerData.value = vtFooterData(props.tableData, vtConfig.value);
    }

    highlightedRows.value = [];

    main(true);
  }

  function main(force = false) {
    const scrollTop = virtualTableContainer.value.scrollTop;
    if (!force && scrollTop === lastScrollTop.value) {
      return;
    }
    lastScrollTop.value = scrollTop;

    let left = 0;
    let right = tableDataLength.value - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (AuxiliaryRowHeights.value[mid] < scrollTop) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    startIndex.value = left;

    paddingTop.value = AuxiliaryRowHeights.value[startIndex.value - 1] || 0;

    let end = startIndex.value + 1;
    let height = props.maxHeight;
    for (let i = startIndex.value + 1; i < tableDataLength.value; i++) {
      height -= rowHeights.value[i];
      if (height <= 0 || i === tableDataLength.value - 1) {
        end = i;
        break;
      }
    }
    endIndex.value = end;

    paddingBottom.value = AuxiliaryRowHeights.value[tableDataLength.value - 1] - AuxiliaryRowHeights.value[endIndex.value];
  }

  function highlightFunc(index: number) {
    const highlightedRowIndex = highlightedRows.value.indexOf(index);
    if (highlightedRowIndex === -1) {
      highlightedRows.value.push(index);
    } else {
      highlightedRows.value.splice(highlightedRowIndex, 1);
    }
  }

  const sourceProp = ref("");
  const targetProp = ref("");

  function dragStartFunc(ev: DragEvent) {
    if (!props.drag) {
      return;
    }
    if (!ev || !ev.target) {
      return;
    }
    sourceProp.value = (ev.target as HTMLElement).className?.split("vt-col-")[1]?.split(" ")[0];
  }

  function dropFunc(ev: DragEvent) {
    if (!props.drag) {
      return;
    }
    if (!ev || !ev.target) {
      return;
    }
    const eTarget = ev.target as HTMLElement;
    if (!eTarget.parentNode || !eTarget.parentNode.parentNode) {
      return;
    }
    const eTargetParentNode = eTarget.parentNode as HTMLElement;
    const eTargetParentNodeParentNode = eTargetParentNode.parentNode as HTMLElement;

    const targetClass = eTarget.nodeName === "SPAN" ? eTargetParentNodeParentNode.className : eTargetParentNode.className;

    targetProp.value = targetClass?.split("vt-col-")[1]?.split(" ")[0];

    reorder(sourceProp.value, targetProp.value);
  }

  function reorder(source: string, target: string) {
    if (!source || !target) {
      return;
    }
    if (source === target) {
      return;
    }

    const list = JSON.parse(JSON.stringify(vtConfig.value));

    const sourceItem = list.find((item: any) => item.prop === source);
    const targetItem = list.find((item: any) => item.prop === target);

    if (sourceItem?.fixed || targetItem?.fixed) {
      return;
    }

    const sourceIndex1 = list.findIndex((item: any) => item.prop === source);
    const targetIndex1 = list.findIndex((item: any) => item.prop === target);

    const fix = sourceIndex1 < targetIndex1 ? 1 : 0;

    const sourceIndex2 = list.findIndex((item: any) => item.prop === source);
    const removed = list.splice(sourceIndex2, 1)[0];

    const targetIndex2 = list.findIndex((item: any) => item.prop === target) + fix;
    list.splice(targetIndex2, 0, removed);

    list.forEach((item: any, index: number) => {
      item.order = index + 1;
    });

    vtConfig.value = JSON.parse(JSON.stringify(list));
  }

  function dragEnterFunc(ev: DragEvent) {
    if (props.drag) {
      ev.preventDefault();
    }
  }
  function dragOverFunc(ev: DragEvent) {
    if (props.drag) {
      ev.preventDefault();
    }
  }
</script>

<style scoped lang="scss">
  .virtual-table-container {
    overflow: auto;
    width: fit-content;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      cursor: pointer;
      border-radius: 2px;
      background-color: #eeeeee;
      &:hover {
        background-color: #dddddd;
      }
    }

    .virtual-table {
      .virtual-table-item {
        :deep(.virtual-table-row) {
          font-size: 14px;
          display: flex;

          .vt-col {
            display: flex;
            flex-direction: column;

            .vt-cell {
              border-right: 1px solid #dddddd;
              border-bottom: 1px solid #dddddd;
              width: inherit;
              min-height: v-bind("`${rowHeight}px`");
              height: 100%;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              background-color: #ffffff;

              & > span {
                margin: 0px 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                &.btn-text {
                  color: #188ac3;
                  cursor: pointer;
                  margin: 0px;
                  margin-left: 8px;

                  &:hover {
                    color: lighten(#188ac3, 10%);
                  }
                  &:active {
                    color: lighten(#188ac3, 20%);
                  }

                  &[disabled="true"] {
                    color: #bbbbbb;
                    pointer-events: none;
                  }
                }
              }
            }

            &:first-of-type {
              .vt-cell {
                border-left: 1px solid #dddddd;
              }
            }

            &.center {
              .vt-cell {
                justify-content: center;
              }
            }
            &.right {
              .vt-cell {
                justify-content: right;
              }
            }

            &.fixed {
              position: sticky;
            }

            &.outline {
              outline: 1px solid #dddddd;
            }
          }
          &:hover {
            .vt-col {
              .vt-cell {
                background-color: #f0f8ff;
              }
            }
          }
        }

        &.virtual-table-header {
          position: sticky;
          top: 0px;
          z-index: 1;
          :deep(.virtual-table-row) {
            .vt-col {
              .vt-cell {
                background-color: #188ac3;
                color: #ffffff;
              }
            }
          }
        }

        &.virtual-table-footer {
          position: sticky;
          bottom: 0px;
          z-index: 1;
          :deep(.virtual-table-row) {
            .vt-col {
              .vt-cell {
                background-color: #f5f7fa;
                color: #999999;
              }
            }
          }
        }

        &:first-of-type {
          :deep(.virtual-table-row) {
            .vt-col {
              .vt-cell {
                &:first-of-type {
                  border-top: 1px solid #dddddd;
                }
              }
            }
          }
        }

        &.highlight {
          :deep(.virtual-table-row) {
            .vt-col {
              .vt-cell {
                background-color: antiquewhite;
              }
            }
          }
        }
      }
    }
  }
</style>
