"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

interface AvailabilityInputProps {
  value: WeeklyAvailability;
  onChange: (availability: WeeklyAvailability) => void;
  error?: string;
}

const DAYS = [
  { key: "monday", label: "星期一" },
  { key: "tuesday", label: "星期二" },
  { key: "wednesday", label: "星期三" },
  { key: "thursday", label: "星期四" },
  { key: "friday", label: "星期五" },
  { key: "saturday", label: "星期六" },
  { key: "sunday", label: "星期日" },
] as const;

export function AvailabilityInput({ value, onChange, error }: AvailabilityInputProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (day: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    const newValue = { ...value };
    newValue[day] = [...newValue[day], { start: "", end: "" }];
    onChange(newValue);
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    const newValue = { ...value };
    newValue[day] = newValue[day].filter((_, i) => i !== index);
    onChange(newValue);
  };

  const updateTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number,
    field: "start" | "end",
    time: string
  ) => {
    const newValue = { ...value };
    newValue[day][index][field] = time;
    onChange(newValue);
  };

  const isValidTime = (time: string): boolean => {
    if (!time) return false;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const isDayAvailable = (day: keyof WeeklyAvailability): boolean => {
    return value[day].length > 0 && value[day].some(slot => slot.start && slot.end);
  };

  const getTotalSlots = (): number => {
    return Object.values(value).reduce((total, slots) => {
      return total + slots.filter(slot => slot.start && slot.end).length;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          {DAYS.map(({ key, label }) => {
            const dayKey = key as keyof WeeklyAvailability;
            const isExpanded = expandedDays.has(key);
            const hasSlots = isDayAvailable(dayKey);

            return (
              <div key={key} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`day-${key}`}
                      checked={isExpanded || hasSlots}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleDay(key);
                          if (!hasSlots) {
                            addTimeSlot(dayKey);
                          }
                        } else {
                          toggleDay(key);
                          // Clear all slots for this day
                          const newValue = { ...value };
                          newValue[dayKey] = [];
                          onChange(newValue);
                        }
                      }}
                    />
                    <Label
                      htmlFor={`day-${key}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {label}
                    </Label>
                    {hasSlots && (
                      <span className="text-xs text-muted-foreground">
                        ({value[dayKey].filter(s => s.start && s.end).length} 個時段)
                      </span>
                    )}
                  </div>
                  {isExpanded && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(dayKey)}
                    >
                      + 添加時段
                    </Button>
                  )}
                </div>

                {isExpanded && (
                  <div className="ml-8 space-y-2 mt-3">
                    {value[dayKey].length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        尚未添加時段，點擊「添加時段」按鈕
                      </p>
                    )}
                    {value[dayKey].map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-muted/50 p-2 rounded-md"
                      >
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateTimeSlot(dayKey, index, "start", e.target.value)
                          }
                          className="h-9 flex-1"
                          placeholder="開始時間"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateTimeSlot(dayKey, index, "end", e.target.value)
                          }
                          className="h-9 flex-1"
                          placeholder="結束時間"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(dayKey, index)}
                          className="h-9 w-9 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            已設定 {getTotalSlots()} 個可用時段
          </p>
        </div>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        提示：選擇您每週可提供義教的日子，並添加具體的時段。可為每天添加多個時段。
      </p>
    </div>
  );
}
