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
          <div class="row">
            <div
              v-for="(item, index) in vtConfig"
              :key="index"
              :class="vtcc(vtConfig, item.prop || item.type)"
              :style="vtcs(vtConfig, item.prop || item.type)"
              :draggable="!item.fixed"
              @dragstart="handleDragStart"
              @drop="handleDrop"
              @dragenter.prevent
              @dragover.prevent
            >
              <div class="cell">
                <span v-if="item.type === 'index'" title="序号">序号</span>
                <span v-else-if="item.type === 'operations'" title="操作">操作</span>
                <span v-else :title="item.label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </slot>
      </div>
      <template v-for="(item, index) in list" :key="index">
        <div
          class="virtual-table-item"
          v-if="index >= startIndex && index <= endIndex"
          @click="highlightFunc(index)"
          :class="{ highlight: highlights.includes(index) }"
        >
          <slot :item="item" :index="index"></slot>
        </div>
      </template>
      <div class="virtual-table-item virtual-table-footer">
        <slot name="footer">
          <div class="row">
            <div
              class="col"
              v-for="(item, index) in vtConfig"
              :key="index"
              :class="vtcc(vtConfig, item.prop || item.type)"
              :style="vtcs(vtConfig, item.prop || item.type)"
            >
              <div class="cell">
                <span :title="sumResult[item.prop || item.type]" v-if="sumResult">{{ sumResult[item.prop || item.type] }}</span>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { vtSum, vtcc, vtcs } from "@/utils";
  import { onMounted, ref, watch } from "vue";
  import type { Ref, PropType } from "vue";

  const props = defineProps({
    list: {
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
    detailKey: {
      type: String,
      required: false,
      default: "",
    },
    vtConfig: {
      type: Array as PropType<any[]>,
      required: true,
    },
  });

  const emit = defineEmits(["reorder"]);

  onMounted(() => {
    watch(
      () => props.list,
      () => {
        init();
      },
    );
  });

  const sumResult = ref();

  const virtualTableContainer = ref();

  const startIndex = ref(0);
  const endIndex = ref(0);

  const paddingTop = ref(0);
  const paddingBottom = ref(0);

  const rowHeights: Ref<number[]> = ref([]);
  const rowHeights2: Ref<number[]> = ref([]);

  const listLength = ref(0);

  const lastScrollTop = ref(0);

  const highlights: Ref<number[]> = ref([]);

  function init() {
    listLength.value = props.list.length;

    props.list.forEach((item, index) => {
      const detailLength = props.detailKey ? item[props.detailKey].length : 1;
      rowHeights.value[index] = props.rowHeight * detailLength;
    });

    let sum = 0;
    for (let i = 0; i < listLength.value; i++) {
      sum += rowHeights.value[i];
      rowHeights2.value[i] = sum;
    }

    sumResult.value = vtSum(props.list, props.vtConfig);

    highlights.value = [];

    main(true);
  }

  function main(force: boolean = false) {
    const scrollTop = virtualTableContainer.value.scrollTop;
    if (!force && scrollTop === lastScrollTop.value) {
      return;
    }
    lastScrollTop.value = scrollTop;

    let left = 0;
    let right = listLength.value - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (rowHeights2.value[mid] < scrollTop) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    startIndex.value = left;

    paddingTop.value = rowHeights2.value[startIndex.value - 1] || 0;

    let end = startIndex.value + 1;
    let height = props.maxHeight;
    for (let i = end; i < listLength.value; i++) {
      height -= rowHeights.value[i];
      if (height <= 0 || i === listLength.value - 1) {
        end = i;
        break;
      }
    }
    endIndex.value = end;

    paddingBottom.value = rowHeights2.value[listLength.value - 1] - rowHeights2.value[endIndex.value];
  }

  function highlightFunc(index: number) {
    const i = highlights.value.indexOf(index);
    if (i === -1) {
      highlights.value.push(index);
    } else {
      highlights.value.splice(i, 1);
    }
  }

  const source = ref("");
  const target = ref("");
  function handleDragStart(e: any) {
    source.value = e.target.className.split("vtc-")[1].split(" ")[0];
  }
  function handleDrop(e: any) {
    const targetClass = e.target.nodeName === "SPAN" ? e.target.parentNode.parentNode.className : e.target.parentNode.className;
    target.value = targetClass.split("vtc-")[1].split(" ")[0];
    if (source.value === target.value) {
      return;
    }

    emit("reorder", source.value, target.value);
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
        :deep(.row) {
          font-size: 14px;
          display: flex;

          .col {
            display: flex;
            flex-direction: column;

            .cell {
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
                  margin: 0px;
                  margin-left: 8px;
                }
              }
            }

            &:first-of-type {
              .cell {
                border-left: 1px solid #dddddd;
              }
            }

            &.center {
              .cell {
                justify-content: center;
              }
            }
            &.right {
              .cell {
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
            .col {
              .cell {
                background-color: #f0f8ff;
              }
            }
          }
        }

        &.virtual-table-header {
          position: sticky;
          top: 0px;
          z-index: 1;
          :deep(.row) {
            .col {
              .cell {
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
          :deep(.row) {
            .col {
              .cell {
                background-color: #f5f7fa;
                color: #999999;
              }
            }
          }
        }

        &:first-of-type {
          :deep(.row) {
            .col {
              .cell {
                &:first-of-type {
                  border-top: 1px solid #dddddd;
                }
              }
            }
          }
        }

        &.highlight {
          :deep(.row) {
            .col {
              .cell {
                background-color: antiquewhite;
              }
            }
          }
        }
      }
    }
  }

  :deep(.btn-text) {
    color: #188ac3;
    cursor: pointer;

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
</style>
