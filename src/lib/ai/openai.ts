// Placeholder for OpenAI client
export const openai = {
  chat: {
    completions: {
      create: async (args: any) => {
        console.log("Calling mock OpenAI API", args);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  incidentDate: "2023-10-27",
                  amount: 150.75,
                  description: "Water damage from leaky pipe in kitchen.",
                  parties: ["John Doe", "Jane Smith"],
                }),
              },
            },
          ],
        };
      },
    },
  },
};
