import adminHandler from "@/admin_handler";
import { DB } from "@/db/database";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const candidates = await DB.instance.get_candidates()
    const rankings = await DB.instance.get_rankings()
    const public_votes = await DB.instance.get_votes()
    
    const csv = `Country Name,Public Votes,2 Pts to country,4 Pts to country,6 Pts to country,8 Pts to country,10 Pts to country,12 Pts to country\n${
        rankings.map(({ rankings, voter })  => {
            const sorted_rankings = rankings.sort((entryA, entryB) => entryA.ranking_points - entryB.ranking_points)

            return sorted_rankings.reduce(
                (accumulater, current) => `${accumulater},${current.country}`,
                `${voter},${public_votes.find(entry => entry.candidate === voter)?.votes}`
            ) + ",".repeat(6 - rankings.length)

        }).join('\n')
    }\n${
        public_votes.filter(entry => rankings.find(ranking => ranking.voter !== entry.candidate)).reduce(
            (accumulator, entry) => `${entry.candidate},${entry.votes},,,,,,\n${accumulator}`, ''
        )
    }`

    res.json({ csv })
}

export default adminHandler(handler)