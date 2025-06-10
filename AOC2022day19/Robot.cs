namespace AOC2022day19;

public class Robot(Mineral mineral, int[] cost)
{
    public Mineral Mineral { get; } = mineral;
    public int[] Cost { get; } = cost;

    public State? AddRobot(State state)
    {
        if (!IsEnoughResources(state.resources)) return null;
        State newState = state.Clone();
        PayResources(newState.resources);
        newState.resources[(int)Mineral]--; // 1-minute delay of factory
        newState.robots[(int)Mineral]++;
        return newState;
    }

    private bool IsEnoughResources(int[] resources)
    {
        for (int i = 0; i < Cost.Length; i++)
        {
            if (Cost[i] > resources[i]) return false;
        }

        return true;
    }

    private void PayResources(int[] resources)
    {
        for (int i = 0; i < Cost.Length; i++)
        {
            resources[i] -= Cost[i];
        }
    }
}