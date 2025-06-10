namespace AOC2022day19;

public class State
{
    public int[] resources { get; } = new int[5];
    public int[] robots { get; } = new int[5];


    public State Clone()
    {
        State newState = new State();
        for (int i = 0; i < 5; i++)
        {
            newState.resources[i] = resources[i];
            newState.robots[i] = robots[i];
        }
        return newState;
    }
}