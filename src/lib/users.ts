export const getUserData = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};