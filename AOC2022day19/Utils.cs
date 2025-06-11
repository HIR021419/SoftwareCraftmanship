using System.Text.RegularExpressions;

namespace AOC2022day19;

public static class Utils
{
    public static string[] OpenFile(string inputPath)
    {
        try
        {
            return File.ReadAllLines(inputPath);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return [];
        }
    }

    public static void WriteOutput(Response response, string inputPath = "./analysis.txt")
    {
        File.WriteAllText(inputPath, ""); 
        
        foreach (BlueprintResponse blueprint in response.blueprints)
        {
            File.AppendAllText(inputPath, $"Blueprint {blueprint.id}: {blueprint.quality}" + Environment.NewLine);
        }
        
        File.AppendAllText(inputPath, Environment.NewLine + $"Best blueprint is the blueprint {response.bestBlueprint}." + Environment.NewLine);
    }

    public static Blueprint[] Parse(string[] input)
    {
        Regex rx = new Regex(@"^.*(\d+).*(\d+).*(\d+).*(\d+).*(\d+).*(\d+).*(\d+).*(\d+).*(\d+).*(\d+).*$",
            RegexOptions.Compiled);
        List<Blueprint> blueprints = new List<Blueprint>();
        foreach (string line in input)
        {
            List<Robot> robots = new List<Robot>();
            GroupCollection groups = rx.Match(line).Groups;
            
            // FIXME Adapt regex to be more flexible and able to do in a loop
            robots.Add(new Robot(Mineral.Ore, [int.Parse(groups[1].Value),0,0,0,0]));
            robots.Add(new Robot(Mineral.Clay, [int.Parse(groups[2].Value),0,0,0,0]));
            robots.Add(new Robot(Mineral.Obsidian, [int.Parse(groups[3].Value),int.Parse(groups[4].Value),0,0,0]));
            robots.Add(new Robot(Mineral.Geode, [int.Parse(groups[5].Value),0, int.Parse(groups[6].Value),0,0]));
            robots.Add(new Robot(Mineral.Diamond, [0,int.Parse(groups[8].Value),int.Parse(groups[9].Value),int.Parse(groups[7].Value),0]));
            
            blueprints.Add(new Blueprint(int.Parse(groups[0].Value), robots.ToArray()));
        }
        
        return blueprints.ToArray();
    }
}