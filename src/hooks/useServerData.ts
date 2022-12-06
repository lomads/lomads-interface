import useSWR, { SWRConfiguration } from "swr"

export type Channel = { id: string; name: string; roles: string[] }

export type Category = {
  id: string
  name: string
  channels: Channel[]
}

export type Role = {
  guild: string
  icon: string
  unicodeEmoji: string
  id: string
  name: string
  color: number
  hoist: boolean
  rawPosition: number
  permissions: string
  managed: boolean
  mentionable: boolean
  createdTimestamp: number
}

type ServerData = {
  serverIcon: string
  membersWithoutRole: number
  serverName: string
  serverId: string
  categories: Category[]
  isAdmin: boolean
  channels?: any[]
  roles: Role[]
}

const fallbackData = {
  serverIcon: null,
  membersWithoutRole: 0,
  serverName: "",
  serverId: "",
  categories: [],
  isAdmin: undefined,
  channels: [],
  roles: [],
}

const useServerData = (serverId: string, swrOptions?: SWRConfiguration) => {
  const shouldFetch = serverId?.length >= 0
  console.log('serverId', shouldFetch)
  console.log(`https://api.guild.xyz/v1/discord/server/${serverId}`)
  const { data, isValidating, error, mutate } = useSWR<ServerData>(
    shouldFetch ? [`https://api.guild.xyz/v1/discord/server/${serverId}`, { method: "POST" }] : null,
    {
      fallbackData,
      revalidateOnFocus: false,
      ...swrOptions,
    }
  )

  console.log(data, isValidating, error)

  return {
    data: {
      ...data,
      channels: data?.categories?.map((category) => category.channels)?.flat(),
    },
    isLoading: isValidating,
    error,
    mutate,
  }
}

export default useServerData
