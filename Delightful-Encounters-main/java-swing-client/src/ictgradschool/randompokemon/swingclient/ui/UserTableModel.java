package ictgradschool.randompokemon.swingclient.ui;

import ictgradschool.randompokemon.swingclient.pojos.User;
import ictgradschool.randompokemon.swingclient.web.API;

import javax.swing.table.AbstractTableModel;
import java.util.List;

public class UserTableModel extends AbstractTableModel {

    private final List<User> users;
    private final String[] columnNames = {"ID", "Username", "Full Name", "Date of Birth", "Description", "Admin","Articles Count"};

    public UserTableModel(List<User> users) {
        this.users = users;
    }

    @Override
    public int getRowCount() {
        return users.size();
    }

    @Override
    public int getColumnCount() {
        return columnNames.length;
    }

    @Override
    public String getColumnName(int column) {
        return columnNames[column];
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        User user = users.get(rowIndex);
        switch (columnIndex) {
            case 0:
                return user.getUser_id();
            case 1:
                return user.getUsername();
            case 2:
                return user.getFname() + " " + user.getLname();
            case 3:
                return user.getDate_of_birth();
            case 4:
                return user.getDescription();
            case 5:
                return user.isAdmin() ? "Admin" : "User";
            case 6:
                return user.getCount();
            default:
                return null;
        }
    }
}
