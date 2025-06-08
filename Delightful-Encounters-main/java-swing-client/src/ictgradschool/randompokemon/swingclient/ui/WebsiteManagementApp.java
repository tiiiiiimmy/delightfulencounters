package ictgradschool.randompokemon.swingclient.ui;

import ictgradschool.randompokemon.swingclient.pojos.User;
import ictgradschool.randompokemon.swingclient.web.API;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class WebsiteManagementApp extends JFrame {

    private JTextField usernameField;
    private JPasswordField passwordField;
    private JTable userTable;
    private JButton loginButton;
    private JButton logoutButton;
    private JButton deleteButton;
    private JLabel lblAvatar;
    private JLabel lblUsername;

    private UserTableModel userTableModel;

    public WebsiteManagementApp() {
        initComponents();
        setSize(800, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
    }

    private void initComponents() {
        usernameField = new JTextField(20);
        passwordField = new JPasswordField(20);
        userTable = new JTable();
        loginButton = new JButton("Login");
        logoutButton = new JButton("Logout");
        deleteButton = new JButton("Delete User");
        deleteButton.setEnabled(false);  // Disable delete button initially
        logoutButton.setEnabled(false);  // Disable logout button initially

        lblAvatar = new JLabel();
        lblAvatar.setPreferredSize(new Dimension(200, 200));
        lblUsername = new JLabel();
        setLayout(new BorderLayout());

        JPanel loginPanel = new JPanel(new GridLayout(3, 2));
        loginPanel.add(new JLabel("Username:"));
        loginPanel.add(usernameField);
        loginPanel.add(new JLabel("Password:"));
        loginPanel.add(passwordField);
        loginPanel.add(loginButton);
        loginPanel.add(logoutButton);
        add(loginPanel, BorderLayout.NORTH);

        JPanel userPanel = new JPanel(new BorderLayout());
        JScrollPane scrollPane = new JScrollPane(userTable);
        scrollPane.setPreferredSize(new Dimension(scrollPane.getPreferredSize().width, 600));
        userPanel.add(scrollPane, BorderLayout.CENTER);

        JPanel userInfoPanel = new JPanel(new BorderLayout());
        userInfoPanel.setPreferredSize(new Dimension(userInfoPanel.getPreferredSize().width, 220)); // Set height to 220px

        JPanel userDetailsPanel = new JPanel(new BorderLayout());
        userDetailsPanel.add(lblAvatar, BorderLayout.WEST);
        userDetailsPanel.add(lblUsername, BorderLayout.CENTER);

        userInfoPanel.add(new JLabel("User Info:"), BorderLayout.NORTH);
        userInfoPanel.add(userDetailsPanel, BorderLayout.CENTER);

        userPanel.add(userInfoPanel, BorderLayout.SOUTH);


        add(userPanel, BorderLayout.CENTER);
        add(deleteButton, BorderLayout.SOUTH);

        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleLogin();
            }
        });

        logoutButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleLogout();
            }
        });

        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleDeleteUser();
            }
        });

        userTable.getSelectionModel().addListSelectionListener(new ListSelectionListener() {
            @Override
            public void valueChanged(ListSelectionEvent e) {
                handleUserSelection();
            }
        });
    }

    private void handleLogin() {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        new SwingWorker<Boolean, Void>() {
            @Override
            protected Boolean doInBackground() throws Exception {
                return API.getInstance().login(username, password);
            }

            @Override
            protected void done() {
                try {
                    boolean success = get();
                    if (success) {
                        loadUserData();
                        loginButton.setEnabled(false);  // Disable login button
                        logoutButton.setEnabled(true);  // Enable logout button
                    } else {
                        JOptionPane.showMessageDialog(WebsiteManagementApp.this, "Login failed.");
                    }
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }
            }
        }.execute();
    }

    private void handleLogout() {
        new SwingWorker<Boolean, Void>() {
            @Override
            protected Boolean doInBackground() throws Exception {
                return API.getInstance().logout();
            }

            @Override
            protected void done() {
                try {
                    boolean success = get();
                    if (success) {
                        clearUserData();
                        JOptionPane.showMessageDialog(WebsiteManagementApp.this, "Logged out successfully.");
                        loginButton.setEnabled(true);  // Enable login button
                        logoutButton.setEnabled(false);  // Disable logout button
                    } else {
                        JOptionPane.showMessageDialog(WebsiteManagementApp.this, "Logout failed.");
                    }
                } catch (InterruptedException | ExecutionException e) {
                    e.printStackTrace();
                }
            }
        }.execute();
    }

    private void handleDeleteUser() {
        int selectedRow = userTable.getSelectedRow();
        if (selectedRow >= 0) {
            int userId = (int) userTableModel.getValueAt(selectedRow, 0); // Assuming user_id is in the first column
            new SwingWorker<Boolean, Void>() {
                @Override
                protected Boolean doInBackground() throws Exception {
                    return API.getInstance().deleteUser(userId);
                }

                @Override
                protected void done() {
                    try {
                        boolean success = get();
                        if (success) {
                            loadUserData();
                            lblAvatar.setIcon(null);
                            lblUsername.setText(""); // Clear the username label
                        } else {
                            JOptionPane.showMessageDialog(WebsiteManagementApp.this, "Failed to delete user.");
                        }
                    } catch (InterruptedException | ExecutionException e) {
                        e.printStackTrace();
                    }
                }
            }.execute();
        } else {
            JOptionPane.showMessageDialog(this, "Please select a user to delete.");
        }
    }

    private void loadUserData() {
        new SwingWorker<List<User>, Void>() {
            @Override
            protected List<User> doInBackground() throws Exception {
                return API.getInstance().getAllUsers();
            }

            @Override
            protected void done() {
                try {
                    List<User> users = get();
                    for (User user : users) {
                        int count = API.getInstance().getArticlesCount(user.getUser_id());
                        user.setCount(count);
                    }
                    userTableModel = new UserTableModel(users);
                    userTable.setModel(userTableModel);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }.execute();
    }

    private void clearUserData() {
        userTableModel = new UserTableModel(List.of());
        userTable.setModel(userTableModel);
        lblAvatar.setIcon(null);
        lblUsername.setText(""); // Clear the username label
        deleteButton.setEnabled(false);  // Disable delete button when no user data
    }

    private void handleUserSelection() {
        int selectedRow = userTable.getSelectedRow();
        if (selectedRow >= 0) {
            deleteButton.setEnabled(true);  // Enable delete button when a user is selected

            int userId = (int) userTableModel.getValueAt(selectedRow, 0); // Assuming user_id is in the first column

            new SwingWorker<User, Void>() {
                @Override
                protected User doInBackground() throws Exception {
                    return API.getInstance().getUserInfo(userId);
                }

                @Override
                protected void done() {
                    try {
                        User user = get();
                        if (user != null) {
                            // Load and set avatar
                            ImageIcon avatarIcon = loadAvatar(user.getAvatar());
                            lblAvatar.setIcon(avatarIcon);
                            // Set the username
                            lblUsername.setText(user.getUsername());
                        } else {
                            JOptionPane.showMessageDialog(WebsiteManagementApp.this, "User not found.");
                        }
                    } catch (InterruptedException | ExecutionException e) {
                        e.printStackTrace();
                    }
                }
            }.execute();
        } else {
            deleteButton.setEnabled(false);  // Disable delete button when no user is selected
        }
    }

    private ImageIcon loadAvatar(String avatarPath) {
        if (avatarPath == null || avatarPath.isEmpty()) {
            return null;
        }

        try {
            // Assuming avatarPath is just the filename, append it to the base URL
            URL url = new URL("http://localhost:3000/images/" + avatarPath);
            Image image = ImageIO.read(url);
            Image scaledImage = image.getScaledInstance(200, 200, Image.SCALE_SMOOTH);
            return new ImageIcon(scaledImage);
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Error loading avatar from URL: " + e.getMessage());
            return null;
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new WebsiteManagementApp());
    }
}
