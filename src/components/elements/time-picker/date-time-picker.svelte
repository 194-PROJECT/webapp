<script lang="ts">
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		Time,
		now,
		ZonedDateTime
	} from '@internationalized/date';
	import { Calendar } from '$components/elements/calendar';
	import * as Popover from '$components/elements/popover';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { buttonVariants } from '$components/elements/button';
	import { cn } from '$lib/utils';
	import TimePicker from './time-picker.svelte';
	import TimePicker_12h from './time-picker-12h.svelte';

	const df = new DateFormatter('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hourCycle: 'h23'
	});

	let contentRef = $state<HTMLElement | null>(null);
	let dateValue = $state<DateValue>();

	let {
		date = $bindable(),
		class: className,
		disabled = false,
		setDate
	}: {
		date?: DateValue;
		class?: string;
		disabled?: boolean;
		setDate?: (date: DateValue) => void;
	} = $props();

	let time = $state(
		new Time((date as ZonedDateTime)?.hour ?? 0, (date as ZonedDateTime)?.minute ?? 0)
	);

	function onValueChange(_date: DateValue | undefined) {
		date = date?.set({
			year: _date?.year,
			month: _date?.month,
			day: _date?.day,
			minute: time.minute,
			hour: time.hour,
			second: time.second
		});

		date && setDate?.(date);
	}

	function setTime(time: Time) {
		date = date?.set({
			minute: time.minute,
			hour: time.hour,
			second: time.second
		});

		date && setDate?.(date);
	}
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'justify-start text-left font-normal'
			}),
			!date && 'text-muted-foreground',
			className
		)}
		{disabled}
	>
		<CalendarIcon />
		{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0">
		<div class="flex border-b p-2">
			<TimePicker
				bind:time
				setTime={(time) => {
					time && setTime(time);
				}}
				{disabled}
			/>
		</div>

		<Calendar {onValueChange} type="single" bind:value={dateValue} {disabled} />
	</Popover.Content>
</Popover.Root>
