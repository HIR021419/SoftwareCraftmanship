namespace AOC2022day19;

public class Response
{
    public int bestBlueprint;
    public BlueprintResponse[] blueprints;
    public Response((int, int)[] blueprintsResult)
    {
        (int, int) max = (0, 0);
        List<BlueprintResponse> res = new();
        foreach ((int,int) result in blueprintsResult)
        {
            res.Add(new BlueprintResponse(result.Item1, result.Item2));
            if (result.Item2 > max.Item2) max = result;
        }

        bestBlueprint = max.Item1;
    }
}