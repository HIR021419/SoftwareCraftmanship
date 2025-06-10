namespace AOC2022day19;

class Program
{
    static void Main(string[] args)
    {
        (int, int) max = (-1, -1);

        string[] input = Utils.OpenFile("../../../inputs/input_diamond.txt");
        Blueprint[] blueprints = Utils.Parse(input);
        foreach (Blueprint blueprint in blueprints)
        {
            int res = TestBlueprint(blueprint);
            if (res > max.Item2) max = (blueprint.Index, res);
        }
        
        Console.WriteLine(max.Item1);
    }

    static int TestBlueprint(Blueprint blueprint)
    {
        int max = -1;
        
        List<State> previousStates = [];
        List<State> currentStates = [new()];
        for (int i = 0; i < 24; i++)
        {
            previousStates = currentStates.GetRange(0, currentStates.Count);
            foreach (State state in previousStates)
            {
                foreach (Robot robot in blueprint.Robots)
                {
                    State? newState = robot.AddRobot(state);
                    if (newState != null) currentStates.Add(newState);
                }

                currentStates.Add(state);
            }
            foreach (State state in currentStates) state.MineResources();

            currentStates.Sort();
        }
        
        return blueprint.Index * GetMax(currentStates.ToArray());
    }

    private static int GetMax(State[] states)
    {
        if (states.Length == 0) return 0;
        int max = states[0].resources[4];
        for (int i = 1; i < states.Length; i++)
        {
            if (states[i].resources[4] > max) max = states[i].resources[4];
        }
        return max;
    }
}