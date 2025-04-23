package org.example;

import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.aventstack.extentreports.*;

import java.io.FileOutputStream;
import java.io.IOException;

public class StudentScoreCounter {
    public static void main(String[] args) {
        ExtentReports extent = new ExtentReports();
        ExtentSparkReporter spark = new ExtentSparkReporter("UpdateStudentRecordsReport.html");
        extent.attachReporter(spark);
        ExtentTest test = extent.createTest("Update 10 Student Records to Excel");

        String[] headers = {"ID", "Name", "Subject1", "Subject2", "Subject3"};
        String[][] students = {
                {"1", "Vinay", "75", "82", "91"},
                {"2", "Bob", "64", "59", "70"},
                {"3", "Charlie", "88", "92", "85"},
                {"4", "David", "47", "60", "55"},
                {"5", "Eva", "90", "89", "94"},
                {"6", "Frank", "66", "72", "69"},
                {"7", "Grace", "81", "78", "84"},
                {"8", "Hannah", "53", "67", "59"},
                {"9", "Ian", "88", "90", "93"},
                {"10", "Jane", "76", "80", "85"}
        };

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Students");

            // Header row
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            // Data rows
            for (int i = 0; i < students.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < students[i].length; j++) {
                    row.createCell(j).setCellValue(students[i][j]);
                }
            }

            FileOutputStream fileOut = new FileOutputStream("StudentRecords.xlsx");
            workbook.write(fileOut);
            fileOut.close();

            test.pass("Successfully updated 10 student records to StudentRecords.xlsx");

        } catch (IOException e) {
            test.fail("Failed to write Excel file: " + e.getMessage());
        }

        extent.flush();
    }
}

