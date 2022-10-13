import { fetcherWithDCAuth } from "../hooks/useDCAuth";
import useSWR from "swr"
import useToast from "./useToast"

const fetchUsersServers = async (_:any, authorization: string) =>
  fetcherWithDCAuth(authorization, "https://discord.com/api/users/@me/guilds").then(
    (res: any[]) => {
      if (!Array.isArray(res)) return []
      return res
        .filter(
          ({ owner, permissions }) => owner || (permissions & (1 << 3)) === 1 << 3
        )
        .map((value:any) => {
            console.log(".map((value:any) ", value)
        return {
          img: value.icon
            ? `https://cdn.discordapp.com/icons/${value.id}/${value.icon}.png`
            : "/default_discord_icon.png",
          id: value.id,
          name: value.name,
          owner: value.owner,
        }})
    }
  )

const useUsersServers = (authorization: any) => {
  const toast = useToast()
  const { data: servers, ...rest } = useSWR(
    authorization ? ["usersServers", authorization] : null,
    fetchUsersServers,
    {
      onError: (error: any) => {
        toast({
          status: "error",
          title: error?.error || "Discord error",
          description:
            error?.errorDescription ||
            error?.message ||
            "Failed to fetch Discord data. If you're using some tracking blocker extension, please try turning that off",
        })
      },
    }
  )
  return { servers, ...rest }
}

export default useUsersServers
