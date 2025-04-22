import java.util.ArrayList;
import java.util.List;

public class StudentScoreCounter {
    // Method to count students with marks greater than 60
    public static int countHighScorers(int[] scores) {
        int count = 0;
        for (int score : scores) {
            if (score > 60) {
                count++;
            }
        }
        return count;
    }

    // Method to list students with marks greater than 60
    public static List<Integer> getHighScorers(int[] scores) {
        List<Integer> highScorers = new ArrayList<>();
        for (int score : scores) {
            if (score > 60) {
                highScorers.add(score);
            }
        }
        return highScorers;
    }

    public static void main(String[] args) {
        int[] studentScores = {45, 78, 62, 90, 55, 61, 88, 59};
        int count = countHighScorers(studentScores);
        List<Integer> highScorers = getHighScorers(studentScores);
        System.out.println("📊 Number of students with marks greater than 60: " + count);
        System.out.println("✅ Scores of students with marks greater than 60: " + highScorers);
    }
}
