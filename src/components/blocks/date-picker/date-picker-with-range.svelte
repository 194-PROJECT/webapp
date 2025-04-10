<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$components/elements/button/index.js";
  import { RangeCalendar } from "$components/elements/range-calendar/index.js";
  import * as Popover from "$components/elements/popover/index.js";

  let {
    value = $bindable({
      start: new CalendarDate(2022, 1, 20),
      end: new CalendarDate(2022, 1, 20).add({ days: 20 }),
    }),
  } : {
    value: {
      start: CalendarDate;
      end: CalendarDate;
    }
  } = $props();

  const df = new DateFormatter("en-US", {
    dateStyle: "medium",
  });
</script>

<div class="grid gap-2">
  <Popover.Root>
    <Popover.Trigger>
      <Button
        variant="outline"
        class={cn(
          "w-[300px] justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {#if value && value.start}
          {#if value.end}
            {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
              value.end.toDate(getLocalTimeZone())
            )}
          {:else}
            {df.format(value.start.toDate(getLocalTimeZone()))}
          {/if}
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value
        placeholder={value?.start}
        numberOfMonths={2}
      />
    </Popover.Content>
  </Popover.Root>
</div>
