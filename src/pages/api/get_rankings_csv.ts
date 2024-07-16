import adminHandler from "@/admin_handler";
import { DB } from "@/db/database";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const rankings = await DB.instance.get_rankings();
    
    const csv = `Country Name,2 Pts to country,4 Pts to country,6 Pts to country,8 Pts to country,10 Pts to country,12 Pts to country\n${
        rankings.map(voter_rankings  => {
            const sorted_rankings = voter_rankings.rankings.sort((entryA, entryB) => entryA.ranking_points - entryB.ranking_points)

            return sorted_rankings.reduce(
                (accumulater, current) => `${accumulater},${current.country}`,
                voter_rankings.voter
            ) + ",".repeat(6 - voter_rankings.rankings.length)

        }).join('\n')
    }`

    res.json({ csv })
}

export default adminHandler(handler)