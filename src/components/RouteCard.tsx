'use client'

import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Bus,
  Footprints,
  Train,
  TramFront,
  Sparkles,
  ChevronDown,
  MessageSquare,
  Users,
} from 'lucide-react-native'
import { cn } from '@/lib/utils'
import { type Route, type RouteLeg } from '@/types/routes'

// Interfaces and Types
interface RouteCardProps {
  route: Route
  isExpanded?: boolean
  onToggle?: () => void
}

type Sentiment = 'warning' | 'positive' | 'neutral'

interface Insight {
  text: string
  sentiment: Sentiment
  socialCount: number
}

interface AiInsightRule {
  match: (leg: RouteLeg, index: number) => boolean
  insight: Insight
}

// Style and Icon Helpers
const getMatchColor = (match: number) => {
  if (match >= 90) return 'text-green-600'
  if (match >= 75) return 'text-blue-600'
  return 'text-amber-600'
}

const getMatchBgColor = (match: number) => {
  if (match >= 90) return 'bg-green-50 border-green-200'
  if (match >= 75) return 'bg-blue-50 border-blue-200'
  return 'bg-amber-50 border-amber-200'
}

const getModeIcon = (mode: string, line?: string) => {
  switch (mode) {
    case 'walk':
      return <Footprints className="h-5 w-5 text-gray-500" />
    case 'bus':
      return (
        <View className="flex flex-row items-center gap-1">
          <Bus className="h-5 w-5 text-blue-600" />
          {line && (
            <Text className="text-xs font-semibold text-blue-600">
              {line}
            </Text>
          )}
        </View>
      )
    case 'tram':
      return (
        <View className="flex flex-row items-center gap-1">
          <TramFront className="h-5 w-5 text-green-600" />
          {line && (
            <Text className="text-xs font-semibold text-green-600">
              {line}
            </Text>
          )}
        </View>
      )
    case 'metro':
      return (
        <View className="flex flex-row items-center gap-1">
          <Train className="h-5 w-5 text-orange-600" />
          {line && (
            <Text className="text-xs font-semibold text-orange-600">
              {line}
            </Text>
          )}
        </View>
      )
    default:
      return null
  }
}

// Data-driven AI Insights
const aiInsightRules: AiInsightRule[] = [
  {
    match: (leg, index) => leg.mode === 'walk' && index === 0,
    insight: {
      text: 'Social media reports indicate poor road conditions on this walking path. Several users mentioned uneven sidewalks near the campus area.',
      sentiment: 'warning',
      socialCount: 23,
    },
  },
  {
    match: (leg, index) => leg.mode === 'bus' && leg.line === '506',
    insight: {
      text: 'This bus route is usually scenic and not as crowded during this time, which fits your preferences perfectly. Great views along Mannerheimintie!',
      sentiment: 'positive',
      socialCount: 47,
    },
  },
  {
    match: (leg, index) => leg.mode === 'walk' && index === 2,
    insight: {
      text: 'This walking route passes through the shopping district. Well-maintained sidewalks with good lighting.',
      sentiment: 'neutral',
      socialCount: 12,
    },
  },
]

const getAiInsight = (
  leg: RouteLeg,
  index: number,
  routeId: number,
): Insight | null => {
  if (routeId !== 1) return null // Only show for first route as demo

  const foundRule = aiInsightRules.find(rule => rule.match(leg, index))
  return foundRule ? foundRule.insight : null
}

const sentimentStyles: Record<
  Sentiment,
  { container: string; sparkles: string; text: string }
> = {
  warning: {
    container: 'bg-amber-50 border-amber-200',
    sparkles: 'text-amber-600',
    text: 'text-amber-900',
  },
  positive: {
    container: 'bg-green-50 border-green-200',
    sparkles: 'text-green-600',
    text: 'text-green-900',
  },
  neutral: {
    container: 'bg-blue-50 border-blue-200',
    sparkles: 'text-blue-600',
    text: 'text-blue-900',
  },
}

// Components
export function RouteCard({
  route,
  isExpanded = false,
  onToggle,
}: RouteCardProps) {
  const [showAiInsights, setShowAiInsights] = useState(false)

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setShowAiInsights(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setShowAiInsights(false)
    }
  }, [isExpanded])

  return (
    <View className={cn('transition-colors', isExpanded && 'bg-gray-100/20')}>
      <TouchableOpacity
        className="p-4 hover:bg-gray-100/30 transition-colors"
        onPress={onToggle}
      >
        <View className="flex flex-row items-start gap-4">
          {/* Time Column */}
          <View className="flex flex-col items-end min-w-[80px]">
            <Text className="text-2xl font-semibold text-gray-800">
              {route.departureTime}
            </Text>
            <Text className="text-sm text-gray-500">{route.arrivalTime}</Text>
            <Text className="text-xs text-gray-500 mt-1">
              {route.duration} min
            </Text>
          </View>

          {/* Route Details Column */}
          <View className="flex-1 space-y-3">
            {/* Transit Icons */}
            <View className="flex flex-row items-center gap-2 flex-wrap">
              {route.legs.map((leg, index) => (
                <View key={index} className="flex flex-row items-center gap-1">
                  {getModeIcon(leg.mode, leg.line)}
                  {index < route.legs.length - 1 && (
                    <View className="w-2 h-px bg-gray-200 mx-1" />
                  )}
                </View>
              ))}
            </View>

            {/* Route Description */}
            <View className="text-sm text-gray-500 space-y-1">
              {route.legs.map((leg, index) => (
                <View key={index} className="flex flex-row items-center gap-2">
                  {leg.mode === 'walk' ? (
                    <Text>Walk {leg.distance}</Text>
                  ) : (
                    <Text>
                      {leg.mode.charAt(0).toUpperCase() + leg.mode.slice(1)}{' '}
                      {leg.line} • {leg.from} → {leg.to}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* AI Enhancement Badge */}
            <View
              className={cn(
                'inline-flex items-start gap-2 px-3 py-2 rounded-lg border text-sm',
                getMatchBgColor(route.aiMatch),
              )}
            >
              <Sparkles
                className={cn(
                  'h-4 w-4 mt-0.5 flex-shrink-0',
                  getMatchColor(route.aiMatch),
                )}
              />
              <Text className={cn('font-medium', getMatchColor(route.aiMatch))}>
                {route.aiReason}
              </Text>
            </View>
          </View>

          <ChevronDown
            className={cn(
              'h-5 w-5 text-gray-500 transition-transform',
              isExpanded && 'rotate-180',
            )}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="px-4 pb-4 space-y-4 border-t border-gray-200 mt-4 pt-4">
          <Text className="font-semibold text-sm text-gray-800">
            Journey Details
          </Text>

          {/* Journey Legs with AI Insights */}
          <View className="space-y-4">
            {route.legs.map((leg, index) => {
              const insight = getAiInsight(leg, index, route.id)
              const styles = insight ? sentimentStyles[insight.sentiment] : null

              return (
                <View key={index} className="space-y-2">
                  {/* Leg Header */}
                  <View className="flex flex-row items-center gap-3 p-3 bg-gray-100/50 rounded-lg">
                    {getModeIcon(leg.mode, leg.line)}
                    <View className="flex-1">
                      <Text className="font-medium text-sm">
                        {leg.mode === 'walk'
                          ? `Walk ${leg.distance}`
                          : `${
                              leg.mode.charAt(0).toUpperCase() +
                              leg.mode.slice(1)
                            } ${leg.line || ''}`}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {leg.from} → {leg.to} • {leg.duration} min
                      </Text>
                    </View>
                  </View>

                  {/* AI Insight */}
                  {insight && styles && (
                    <View className="ml-8">
                      {!showAiInsights ? (
                        <View className="space-y-2 animate-pulse">
                          <View className="h-3 bg-gray-200 rounded w-3/4"></View>
                          <View className="h-3 bg-gray-200 rounded w-full"></View>
                          <View className="h-3 bg-gray-200 rounded w-2/3"></View>
                        </View>
                      ) : (
                        <View
                          className={cn(
                            'p-3 rounded-lg border text-sm space-y-2',
                            styles.container,
                          )}
                        >
                          <View className="flex flex-row items-start gap-2">
                            <Sparkles
                              className={cn(
                                'h-4 w-4 mt-0.5 flex-shrink-0',
                                styles.sparkles,
                              )}
                            />
                            <Text className={cn('text-sm', styles.text)}>
                              {insight.text}
                            </Text>
                          </View>

                          {/* Social Media Stats */}
                          <View className="flex flex-row items-center gap-4 text-xs text-gray-500 pt-1">
                            <View className="flex flex-row items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <Text>{insight.socialCount} mentions</Text>
                            </View>
                            <View className="flex flex-row items-center gap-1">
                              <Users className="h-3 w-3" />
                              <Text>Community feedback</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      )}
    </View>
  )
}
